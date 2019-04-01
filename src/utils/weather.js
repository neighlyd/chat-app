const request = require('request')
const axios = require('axios')

const getWeather = async (user) => {
    const url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${user.loc.lat},${user.loc.long}`

    try {
        const res = await axios.get(url)
        const data = res.data
        const summary = data.currently.summary.toLowerCase()
        const temp = data.currently.temperature
        const forecast = data.daily.summary.toLowerCase()
        return `It is currently ${summary} and ${temp}. The forecast will be ${forecast}`
    } catch (e) {
        return e
    }


    // request({url, json: true }, (error, { body }) => {
    //     if (error) {
    //         callback('Could not connect to weather service')
    //     }
    //     const summary = body.currently.summary.toLowerCase()
    //     const forecast = body.daily.summary.toLowerCase()
    //     const temp = body.currently.temperature
        
    //     callback(`It is currently ${summary} and ${temp}. The forecast will be ${forecast}`)
    // })
}

module.exports = {
    getWeather
}