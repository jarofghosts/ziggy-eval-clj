var qs = require('querystring').stringify
  , http = require('http')

var cljRex = /\!clj\s+(.*?)/

evalClj.help = '!clj <expr> - eval <expr> and print result'

module.exports = evalClj

function evalClj(ziggy, settings) {
  var url = ((settings || {}).url || 'http://tryclj.com') + '/eval.json?'

  ziggy.on('message', parseMessage)

  function parseMessage(user, channel, message) {
    if(!cljRex.test(message)) return

    var bits = message.split(/\s+/)
      , expr = bits.slice(1).join(' ')

    http.get(url + qs({expr: expr}), respond)

    function respond(res) {
      var data = ''

      res.on('data', function(chunk) {
        data += chunk
      })

      res.on('end', function() {
        try {
          data = JSON.parse(data)
        } catch(e) {
          return console.error(e.message)
        }

        if(!data.hasOwnProperty('result')) return

        ziggy.say(channel, data.result)
      })
    }
  }
}
