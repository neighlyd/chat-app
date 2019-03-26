const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const { generateMessage, generateLocationMessage } = require('../src/utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom, getRoomList } = require('../src/utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
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

        socket.emit('message', generateMessage('Admin', 'Welcome to the Server'))
        
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

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('shareLocation', (coords, callback) => {
        const user = getUser(socket.id)
        if (!user) {
            return callback('You do not have a user profile')
        }

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