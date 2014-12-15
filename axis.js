/**
 * Vertical axis with time ticks
 */
(function(exports) {
  'use strict'

  exports.renderAxis = function renderAxis(options) {
    var template = options.template || timeTemplate
    return hours(options.endOfDay)
      .map(interpolateTime.bind(null, options))
      .map(template)
  }

  function hours(endOfDay) {
    var times = []
    for (var time = 0; time <= endOfDay; time += 30) {
      times.push(time)
    }
    return times
  }

  function interpolateTime(options, time) {
    return {
      time: formatTime(time),
      top: y(options, time)
    }
  }

  function formatTime(time) {
    time += 9 * 60
    var h = Math.floor(time / 60)
    var m = time % 60
    var ampm = m === 0 ? (h < 12 ? 'AM' : 'PM') : ''
    h = ((h + 11) % 12 + 1) // convert to 12h clock
    m = ('0' + m).slice(-2) // zero pad minutes
    return h + ':' + m + ' ' + ampm
  }

  function timeTemplate(tick) {
    var element = document.createElement('div')
    element.className = 'calendar-axis-time'
    element.innerHTML = tick.time
    element.style.top = tick.top
    return element
  }

  function y(options, start) {
    return (options.height * start / options.endOfDay) + 'px'
  }
})(this.module ? this.module.exports : this)
