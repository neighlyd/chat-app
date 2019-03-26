const moment = require('moment')
const linkifyHtml = require('linkifyjs/html')

const generateMessage = (username, message) => {
    const text = linkifyHtml(message, {
        defaultProtocol: 'https'
    })
    return {
        username,
        text,
        createdAt: moment().format('h:mm:ss a')
    }
}

const generateLocationMessage = (username, url) => {
    return {
        username,
        url,
        createdAt: moment().format('h:mm:ss a')
    }
}

module.exports = { 
    generateMessage,
    generateLocationMessage
}