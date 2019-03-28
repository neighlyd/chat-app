const users = []

const addUser = ({ id, username, room }) => {
    
    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and Room are required'
        }
    }
    
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    
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
    const user = {id, username, room}  
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    
    if (index > -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
    
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
    getUser,
    getUsersInRoom,
    getRoomList
}