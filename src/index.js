const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')

const app = express()
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(publicDirectoryPath))

const welcome = 'Welcome to the server'

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.emit('message', welcome)

    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})