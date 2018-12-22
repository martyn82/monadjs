import {Duration} from './../duration';

const implicits = {
  nanosecond:   function () { return Duration(this.valueOf(), Duration.Unit.Nanoseconds); },
  nanoseconds:  function () { return Duration(this.valueOf(), Duration.Unit.Nanoseconds); },
  microsecond:  function () { return Duration(this.valueOf(), Duration.Unit.Microseconds); },
  microseconds: function () { return Duration(this.valueOf(), Duration.Unit.Microseconds); },
  millisecond:  function () { return Duration(this.valueOf(), Duration.Unit.Milliseconds); },
  milliseconds: function () { return Duration(this.valueOf(), Duration.Unit.Milliseconds); },
  second:       function () { return Duration(this.valueOf(), Duration.Unit.Seconds); },
  seconds:      function () { return Duration(this.valueOf(), Duration.Unit.Seconds); },
  minute:       function () { return Duration(this.valueOf(), Duration.Unit.Minutes); },
  minutes:      function () { return Duration(this.valueOf(), Duration.Unit.Minutes); },
  hour:         function () { return Duration(this.valueOf(), Duration.Unit.Hours); },
  hours:        function () { return Duration(this.valueOf(), Duration.Unit.Hours); },
  day:          function () { return Duration(this.valueOf(), Duration.Unit.Days); },
  days:         function () { return Duration(this.valueOf(), Duration.Unit.Days); }
};

for (let p in implicits) {
  if (implicits.hasOwnProperty(p)) {
    Object.defineProperty(Number.prototype, p, {
      get: implicits[p]
    });
  }
}
