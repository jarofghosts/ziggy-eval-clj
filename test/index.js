var EE = require('events').EventEmitter
  , http = require('http')
  , url = require('url')

var plugin = require('../')

var test = require('tape')

var testServer = http.createServer(function(req, res) {
  var query = url.parse(req.url, true).query

  if(query.expr === '(+ 1 2)') return res.end(JSON.stringify({result: '3'}))
  res.end(JSON.stringify({error: true, message: 'derp!'}))
})

testServer.listen(8998)

test('responds to !clj', function(t) {
  t.plan(2)

  var fakeZiggy = new EE

  plugin(fakeZiggy, {url: 'http://localhost:8998'})

  fakeZiggy.say = testValue

  fakeZiggy.emit('message', {}, '#derp', '!clj (+ 1 2)')

  function testValue(channel, value) {
    t.equal(channel, '#derp')
    t.equal(value, '3')
  }
})

test('shows error, if present', function(t) {
  t.plan(2)

  var fakeZiggy = new EE

  plugin(fakeZiggy, {url: 'http://localhost:8998'})

  fakeZiggy.say = testResponse

  fakeZiggy.emit('message', {}, '#derp', '!clj (js 2)')

  function testResponse(channel, message) {
    t.equal(channel, '#derp')
    t.equal(message, 'derp!')

    testServer.close()
  }
})
