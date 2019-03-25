const app = require('./app')
const http = require('http')
const socketio = require('socket.io')

const port = process.env.PORT || 3000
const server = http.createServer(app)
const io = socketio(server)

io.on('connection', () => {
    console.log('New WebSocket connection')
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})