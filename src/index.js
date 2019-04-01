const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')


const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUserById, getUserByNameAndRoom, getUsersInRoom, getRoomList, validateLoc, updateUserLoc } = require('./utils/users')
const { getWeather } = require('./utils/weather')
const { getTime } = require('./utils/time')

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

        socket.emit('message', generateMessage('Admin', 'Welcome to the Server!<br/>To see a list of commands send /help'))
        
        // Let everyone in the waiting room update the room list.
        socket.broadcast.emit('roomList', getRoomList())
        
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined the room.`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on('sendMessage', async (message, callback) => {
        const user = getUserById(socket.id)
        if (!user) {
            return callback('You do not have a user profile')
        }
        // set default recipient to full room.
        let recipient = user.room
        // set default sender as user
        let sender = user.username

        if(message.startsWith('/')){
            
            const messageQuery = message.slice(1).trim().split(' ')
            // change recipient to self for majority of commands.
            recipient = user.id
            // change default sender to 'Admin' for majority of commands.
            sender = 'Admin'
            
            switch(messageQuery[0]){
                case 'help':
                    message = ('The following commands are available:<br />' +
                                        '<code>/time</code> - returns the current date and time of the server<br/>' +
                                        '<code>/weather</code> - returns the current weather and forecast for your region (note: you must share your location first to access this feature)<br/>' +
                                        '<code>/pm &lt;user&gt; &lt;message&gt;</code> - send a private message to another user (same as <code>:pm</code>)<br/>' + 
                                        '<code>/dm &lt;user&gt; &lt;message&gt;</code> - send a private message to another user (same as <code>:pm</code>)')
                    break
                case 'time':
                    if (validateLoc(user)){
                        message = await getTime(user)
                    } else {
                        message = 'You must share your location before you can use this feature.'
                    }
                    break
                case 'weather': 
                    if (validateLoc(user)) {
                        message = await getWeather(user)
                    } else {
                        message = 'You must share your location before you can use this feature.'
                    }
                    break
                case 'dm':
                case 'pm':
                    if (messageQuery.length < 3){
                        message = 'You must specify both a user and a message to send.<br/>Use the format <code>:message user_name message</code> to send your message'
                    } else {
                        recipient = getUserByNameAndRoom(messageQuery[1].toLowerCase(), user.room)
                        if (!recipient) {
                            recipient = user.id
                            message = 'I\'m sorry, but I could not find that user.'
                        } else if (recipient.id === user.id){
                            recipient = user.id
                            message = 'Please stop talking to yourself. It\'s rather quite untoward.'
                        } else {
                            // the recipient of the PM was found. Set them as the receiver and reset the sender as the original user instead of admin (as is default in the switch block)
                            recipient = recipient.id
                            sender = user.username
                            message = messageQuery.slice(2).join(' ')
                        }
                    }
                    break
                default:
                    message = 'That is not a valid command'
            }
        }
        io.to(recipient).emit('message', generateMessage(sender, message))
        callback()
    })

    socket.on('shareLocation', (coords, callback) => {
        const user = getUserById(socket.id)
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