var EE = require('events').EventEmitter

var plugin = require('../')

var test = require('tape')

test('responds to !clj', function(t) {
  t.plan(2)

  var fakeZiggy = new EE

  plugin(fakeZiggy)

  fakeZiggy.say = testValue

  fakeZiggy.emit('message', {}, '#derp', '!clj (+ 1 2)')

  function testValue(channel, value) {
    t.equal(channel, '#derp')
    t.equal(value, '3')
  }
})
