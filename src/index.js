const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const moment = require('moment')

const { generateMessage, generateLocationMessage } = require('../src/utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom, getRoomList, getUserLoc, updateUserLoc } = require('../src/utils/users')
const { getWeather } = require('../src/utils/weather')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    // socket.emit                      ->  sends event to new connections.
    // io.emit                          ->  sends event to all connections.
    // socket.broadcast.emit            ->  sends event to all connections, except the client initiating it.
    // io.to(room).emit                 ->  sends event to all connections in a specific room.
    // socket.broadcast.to(room).emit   ->  sends event to all connections in a specific room, except the client initiating it.
    
    socket.on('load', () => {
        socket.emit('roomList', getRoomList())
    })

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })
        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome to the Server!<br/>To see a list of commands send :help'))
        
        // Let everyone in the waiting room update the room list.
        socket.broadcast.emit('roomList', getRoomList())
        
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined the room.`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        if (!user) {
            return callback('You do not have a user profile')
        }

        if(message.startsWith(':')){
            const messageQuery = message.slice(1).split(' ')
            switch(messageQuery[0]){
                case 'time':
                    const time = moment().format('MMM Do YYYY, hh:mm:ss a')
                    io.to(socket.id).emit('message', generateMessage('Admin', `Server time is now: ${time}`))
                    break
                case 'weather':
                    const loc = getUserLoc(socket.id)
                    if(Object.entries(loc).length === 0 && loc.constructor === Object){
                        io.to(socket.id).emit('message', generateMessage('Admin', 'You must share your location before we can give you the weather forecast.'))   
                    } else {
                        getWeather(loc, (res) => {
                            io.to(socket.id).emit('message', generateMessage('Admin', res))
                        })                        
                    }
                    break
                case 'help':
                    const helpMessage = ('The following commands are available:' +
                                        '<br />:time - returns the current date and time of the server' +
                                        '<br />:weather - returns the current weather and forecast for your region (note: you must share your location first to access this feature)')
                    io.to(socket.id).emit('message', generateMessage('Admin', helpMessage))
                    break
            }
        } else {
            io.to(user.room).emit('message', generateMessage(user.username, message))
        }
        callback()
    })

    socket.on('shareLocation', (coords, callback) => {
        const user = getUser(socket.id)
        if (!user) {
            return callback('You do not have a user profile')
        }
        updateUserLoc(socket.id, coords)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.lat},${coords.long}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        // update room list in waiting room
        socket.broadcast.emit('roomList', getRoomList())
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})