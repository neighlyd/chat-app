const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    let message = document.querySelector('input')
    socket.emit('sendMessage', message.value)
    message.value = ''
})

// socket.on('countUpdated', (count) => {
//     console.log(`The count has been updated to: ${count}`)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     socket.emit('increment')
// })