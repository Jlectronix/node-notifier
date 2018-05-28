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
      return
    }

    let message = 'Automated Message from Dej Notification System. ' +
      'Rise and shine San Diago! It is ' + new Date().toLocaleString() + '. ' +
      'Weather condition: ' + body.currently.summary + ' with an amazing temperature of ' +
      Math.round(body.currently.temperature) + '\xB0 F.'

    client.messages.create({
      to: args[1], // personal
      from: args[2], // twilio
      body: message
    })
    isInitialMessageSent = true

    if (isInitialMessageSent) {
      clearInterval(timer)
      timer = setInterval(() => {
        let message = 'Clone https://github.com/Jlectronix/node-notifier.git ' +
          'and Run me in terminal >>> ' +
          '--- i.e. node notifier.js 7 +15551234567 +15554443333'
        client.messages.create({
          to: args[1],
          from: args[2],
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
  if (new Date().getHours() === parseInt(args[0])) {
    console.error('in')
    processMessage()
  }
}, 30000)
