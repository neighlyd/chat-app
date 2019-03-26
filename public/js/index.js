const socket = io()

// Elements
const $roomSelect = document.querySelector('#room-select')
const $room = document.querySelector('#room')
const $loginForm = document.querySelector('#login-form')
const $roomWarning = document.querySelector('#room-warning')

// Templates
const roomSelectTemplate = document.querySelector('#selection-template').innerHTML
const roomSelectWarningTemplate = document.querySelector('#room-select-warning-template').innerHTML


$loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const username = e.target.username.value
    
    const newRoom = e.target.newRoom.value
    const existingRoom = e.target.existingRoom.value
    
    if (newRoom) {
        location.href=`/chat.html?username=${username}&room=${newRoom}`
    } else if (existingRoom) {
        location.href=`/chat.html?username=${username}&room=${existingRoom}`
    } else {
        const html = Mustache.render(roomSelectWarningTemplate)
        $roomWarning.innerHTML = html
    }
})

socket.on('roomList', (rooms) => {
    const html = Mustache.render(roomSelectTemplate, {
        rooms
    })
    $roomSelect.innerHTML = html
})

socket.emit('load')