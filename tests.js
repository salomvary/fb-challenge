/*eslint-env node*/
'use strict'

require('./vendor/object.assign')
var assert = require('assert')
var layout = require('./layout').layout
var renderDay = require('./day').renderDay

module('layout', function() {
  test('empty input yields empty result', function() {
    var actual = layout([])
    var expected = []
    assert.deepEqual(actual, expected)
  })

  test('single event uses full width', function() {
    var actual = layout([
      {start: 1, end: 2}
    ])
    var expected = [
      {start: 1, end: 2, left: 0, width: 1}
    ]
    assert.deepEqual(actual, expected)
  })

  test('events not colliding use full width', function() {
    var actual = layout([
      {start: 1, end: 2},
      {start: 2, end: 3}
    ])
    var expected = [
      {start: 1, end: 2, left: 0, width: 1},
      {start: 2, end: 3, left: 0, width: 1}
    ]
    assert.deepEqual(actual, expected)
  })

  test('colliding events are side-by-side', function() {
    var actual = layout([
      {start: 1, end: 2},
      {start: 1, end: 2}
    ])
    var expected = [
      {start: 1, end: 2, left: 0, width: 0.5},
      {start: 1, end: 2, left: 0.5, width: 0.5}
    ]
    assert.deepEqual(actual, expected)
  })

  test('maximum possible horizontal space is used', function() {
    var actual = layout([
      {start: 1, end: 3},
      {start: 2, end: 4},
      {start: 3, end: 4}
    ])
    var expected = [
      {start: 1, end: 3, left: 0, width: 0.5},
      {start: 2, end: 4, left: 0.5, width: 0.5},
      {start: 3, end: 4, left: 0, width: 0.5}
    ]
    assert.deepEqual(actual, expected)
  })

  test('when two events that are non subsequent collide', function() {
    var actual = layout([
      {start: 1, end: 4},
      {start: 2, end: 3},
      {start: 3, end: 4}
    ])
    var expected = [
      {start: 1, end: 4, left: 0, width: 0.5},
      {start: 2, end: 3, left: 0.5, width: 0.5},
      {start: 3, end: 4, left: 0.5, width: 0.5}
    ]
    assert.deepEqual(actual, expected)
  })

  test('when more events that are non subsequent collide', function() {
    var actual = layout([
      {start: 1, end: 4},
      {start: 2, end: 3},
      {start: 3, end: 5},
      {start: 4, end: 5}
    ])
    var expected = [
      {start: 1, end: 4, left: 0, width: 0.5},
      {start: 2, end: 3, left: 0.5, width: 0.5},
      {start: 4, end: 5, left: 0, width: 0.5},
      {start: 3, end: 5, left: 0.5, width: 0.5}
    ]
    assert.deepEqual(actual, expected)
  })
})

module('render', function() {
  var options = {
    template: function identity(object) { return object },
    endOfDay: 3,
    height: 30
  }

  test('empty input renders nothing', function() {
    var actual = renderDay([], options)
    var expected = []
    assert.deepEqual(actual, expected)
  })

  test('renders with interpolated dimensions', function() {
    var events = [{
      start: 1,
      end: 2,
      left: 0.25,
      width: 0.5
    }]
    var expected = [{
      start: 1,
      end: 2,
      left: '25%',
      width: '50%',
      top: '10px',
      height: '10px'
    }]
    var actual = renderDay(events, options)
    assert.deepEqual(actual, expected)
  })
})

// Test "framework"

function module(title, body) {
  console.log(title)
  body()
}

function test(title, body) {
  try {
    body()
    console.log(' OK  ', title)
  } catch(e) {
    if (e instanceof assert.AssertionError) {
      console.log(' FAIL', title, e.message)
    } else {
      console.log(' EX  ', title)
      throw e
    }
  }
}
