Facebook Calendar Challenge
by Márton Salomváry <marton.salomvary@gmail.com>

Architecture:

- main.js: point of entry, not much interesting
- calendar.js: main calendar module, wires up everything
- day.js: responsible for rendering events in day view
- layout.js: 2D layout algorithm for events
- axis.js: renders hour ticks for the horizontal axis

Implementation notes:

- Used simple IIFE to organize code into modules. A real-life project would use
  CommonJS or ECMAScript 6 modules.
- A real life project would use a framework to organize code into "views" and
  some sort of utility library for data wrangling (eg. Underscore).
- Nothing is optimized for performance. In a real-life application a highly
  optimized framework would do most of the heavy-lifting. Hotspots would need to
  be identified in individual components separately.

Tested in the following browsers:

- latest Firefox
- latest Chrome
- Safari 7
- IE 11

Not tested on any mobile browser.
