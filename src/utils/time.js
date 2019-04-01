const moment = require('moment-timezone')


const getTime = async (user) => {
    const time = await moment().tz(user.loc.tz).format('MMM Do YYYY, hh:mm:ss a')
    return `The time is currently ${time}`
}

module.exports = {
    getTime
}