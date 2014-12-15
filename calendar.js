/**
 * Calendar day view
 */
(function(exports, renderDay, renderAxis, layout) {
  'use strict'

  var defaults = {
    endOfDay: 12 * 60,
    height: 720
  }

  /**
   * Renders calendar day view of events
   *
   * @param {Array.<Object>} events
   */
  exports.layoutDay = function layoutDay(events) {
    // The specification doesn't say the input is sorted..
    events = events.sort(compareStart)

    update('.calendar-events', function() {
      return renderDay(layout(events), defaults)
    })

    update('.calendar-axis', function() {
      return renderAxis(defaults)
    })
  }

  function update(selector, render) {
    var parent = document.querySelector(selector)
    var children = render()
    parent.innerHTML = ''
    children.forEach(parent.appendChild.bind(parent))
  }

  function compareStart(event1, event2) {
    return event1.start - event2.start
  }
})(this.module ? this.module.exports : this, this.renderDay, this.renderAxis, this.layout)
