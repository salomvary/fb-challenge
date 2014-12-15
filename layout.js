(function(exports) {
  'use strict'

  /**
   * Precalculate optimal layout for events in a daily view. The events will
   * never visually overlap and will use the maximum possible horizontal space.
   *
   * Events must contain `start` and `end` members and the array must be sorted
   * by `start` time.
   *
   * The order of the returned events is not guaranteed.
   *
   * @param {Array.<Object>} events sorted array of event instances
   * @returns {Array.<Object>} the events extended with `left` and `width`
   */
  exports.layout = function layout(events) {
    return events
      .reduce(groupEvents, [])
      .map(layoutGroup)
      .reduce(flatten, [])
  }

  /**
   * Create "collision groups" of events
   *
   * @returns {Array.<Array.<Object>>} grouped events
   */
  function groupEvents(groups, event) {
    var lastGroup = groups[groups.length - 1]
    // If the event collides with any other event in the last group...
    if (isAnyCollision(lastGroup, event)) {
      // add to the last group
      lastGroup.push(event)
    } else {
      // create a new group
      groups.push([event])
    }
    return groups
  }

  /**
   * Lay out a single group of colliding events in two dimensional space
   * so that they use the maximum available space and don't overlap visually
   *
   * Adds `left` and `width` to every event in the group
   *
   * @param {Array.<Object>} collidingEvents
   * @returns {Array.<Object>} events with `left` and `width`
   */
  function layoutGroup(collidingEvents) {
    // Lay out events so that they don't collide
    var rows = collidingEvents.reduce(createRows, [[]])

    // Every event in a collision group has the same width
    var maxRowLength = max(rows.map(function(row) { return row.length }))
    var eventWidth = 1 / maxRowLength

    // Add left and width to every event
    function layoutEvent(event, columnIndex) {
      // Skip gaps
      return event && Object.assign({}, event, {
        left: columnIndex * eventWidth,
        width: eventWidth
      })
    }

    // Turn rows/columns back into a flat array with `left` and `width` computed
    return rows
      .map(function(row) { return row.map(layoutEvent) })
      .reduce(flatten)
      .filter(identity)
  }

  /**
   * Lay out events into rows and columns so that they don't
   * overlap visually
   *
   * @returns {Array.<Array.<Object>>} rows and columns of events
   */
  function createRows(rows, event) {
    function insert(column) {
      var lastRow = rows[rows.length - 1]
      if (!lastRow[column]) {
        lastRow[column] = event
      } else {
        if (isCollision(lastRow[column], event)) {
          insert(column + 1)
        } else {
          var row = []
          row[column] = event
          rows.push(row)
        }
      }
      return rows
    }
    return insert(0)
  }

  /**
   * Do any of `events` collide with `event`?
   * (Assumes `events` starting before `event`)
   */
  function isAnyCollision(events, event) {
    return events && events.some(function(previousEvent) {
      return isCollision(previousEvent, event)
    })
  }

  /**
   * Do two events collide?
   * (Assumes `event1` starts before `event2`)
   */
  function isCollision(event1, event2) {
    return event1.start <= event2.start &&
      event1.end > event2.start
  }

  function max(numbers) {
    return Math.max.apply(Math, numbers)
  }

  function flatten(one, another) {
    return one.concat(another)
  }

  function identity(value) {
    return value
  }
})(this.module ? this.module.exports : this)
