const accountSid = 'AC399637394d7e1ca5e9881377ecccf5b9'
const authToken = '6ac83fe2a6ddbdfde86e8d2ea261b2c9'
const request = require('request')
const client = require('twilio')(accountSid, authToken)
const args = process.argv.slice(2)
const defaultLat = '26.461497'
const defaultLng = '-80.065902'
const weatherUrl =
  `https://api.darksky.net/forecast/0c43df5d396f06c6a950887c129ab963/${defaultLat},${defaultLng}`

function processMessage () {
  request(weatherUrl, { json: true }, (err, resp, body) => {
    if (err) {
      console.error('Issue encountered', err)
      // console.log('Weather service data ->', body)
      return
    }

    var time = new Date(body.currently.time * 1000)
    if (time.getHours() === parseInt(args[0])) {
      let message = 'Automated Message from Dej Notification System. ' +
        'Rise and shine San Diago! It is ' + time.toLocaleString() + '. ' +
        'Weather is ' + body.currently.summary + ' with an amazing temperature of ' +
        body.currently.temperature + '9\xB0 F.'

      client.messages.create({
        to: '+15616999883', // personal
        from: '+15615670246', // twilio
        body: message
      })
      isInitialMessageSent = true
    }

    if (isInitialMessageSent) {
      clearInterval(timer)
      timer = setInterval(() => {
        let message = 'Clone https://github.com/Jlectronix/node-notifier.git ' +
          'and Run me in terminal >>> node notifier.js ' +
          '"onTheHourDigit"' + ' --- i.e. node notifier.js 7'
        client.messages.create({
          to: '+15616999883',
          from: '+15615670246',
          body: message
        })
        clearInterval(timer)
      }, 30000)
    }
  })
}

var count = 0
var isInitialMessageSent = false
var timer = setInterval(() => {
  console.log('Check weather every 30 seconds - so far -> ' + count++)
  processMessage()
}, 30000)
