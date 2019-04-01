const users = []
const tzlookup = require('tz-lookup')

const addUser = ({ id, username, room }) => {
    /*
    user = {
        id: Number,
        username: String.toLowerCase(),
        room: String.toLowerCase(),
        loc: {
            lat: Number,
            long: Number,
            tz: String
        }
    }

    By default, loc is a blank object. It is filled by the updateUserLoc() function when a user shares their location.
    id is the user's socket.id provided by socket.io.
    */
    
    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and Room are required'
        }
    }
    
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    let loc = {}
    
    // Check for unique username
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use for this room'
        }
    }

    // Store user
    const user = {id, username, room, loc}  
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    
    if (index > -1) {
        return users.splice(index, 1)[0]
    }
}

const getUserById = (id) => {
    return users.find((user) => user.id === id)    
}

const getUserByNameAndRoom = (name, room) => {
    return users.find((user) => user.username === name && user.room === room)
}

const validateLoc = (user) => {
    if (Object.entries(user.loc).length === 0){
        return false
    }
    return true
}

const updateUserLoc = (id, loc) => {
    const index = users.findIndex((user) => user.id === id)
    // add timezone to location object
    loc.tz = tzlookup(loc.lat, loc.long)
    
    if (index > -1){
        users[index].loc = loc
    }
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room.trim().toLowerCase())
}

const getRoomList = () => {
    return [...new Set(users.map(user => user.room))]
}

module.exports = {
    addUser,
    removeUser,
    getUserById,
    getUsersInRoom,
    getRoomList,
    updateUserLoc,
    validateLoc,
    getUserByNameAndRoom
}