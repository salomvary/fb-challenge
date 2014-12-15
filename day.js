/**
 * Calendar events in single day view
 */
(function(exports) {
  'use strict'

  /**
   * Renders calendar events in day view. Events must have the following
   * members: `start`, `end`, `left`, `width`.
   *
   * @param {Object[]} events events with precalculated layout
   * @param {Object} options
   * @param {Number} options.endOfDay how long day to render (minutes)
   * @param {Number} options.height height of the calendar (px)
   * @param {Function=} options.template override the built-in template
   *
   * @returns {Array} rendered calendar events
   */
  exports.renderDay = function renderDay(events, options) {
    var template = options.template || eventTemplate
    return events
      .map(interpolate.bind(null, options))
      .map(template)
  }

  function interpolate(options, event) {
    return Object.assign({}, event, {
      left: x(event.left),
      width: x(event.width),
      top: y(options, event.start),
      height: y(options, event.end - event.start)
    })
  }

  function eventTemplate(event) {
    var element = document.createElement('div')
    element.className = 'calendar-event'
    Object.assign(element.style, {
      width: event.width,
      height: event.height,
      left: event.left,
      top: event.top
    })
    return element
  }

  function y(options, start) {
    return (options.height * start / options.endOfDay) + 'px'
  }

  function x(left) {
    return (left * 100) + '%'
  }
})(this.module ? this.module.exports : this)
