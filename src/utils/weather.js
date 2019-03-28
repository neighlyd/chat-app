const request = require('request')

const getWeather = (loc, callback) => {
    const url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${loc.lat},${loc.long}`

    request({url, json: true }, (error, { body }) => {
        if (error) {
            callback('Could not connect to weather service')
        }
        const summary = body.currently.summary.toLowerCase()
        const forecast = body.daily.summary.toLowerCase()
        const temp = body.currently.temperature
        
        callback(`It is currently ${summary} and ${temp}. The forecast will be ${forecast}`)
    })
}

module.exports = {
    getWeather
}