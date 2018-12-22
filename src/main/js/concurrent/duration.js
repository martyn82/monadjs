const m2 = Math.pow(1000, 2);
const m3 = Math.pow(1000, 3);

const Units = {
  Nanoseconds: 1,
  Microseconds: 2,
  Milliseconds: 3,
  Seconds: 4,
  Minutes: 5,
  Hours: 6,
  Days: 7
};

export const Duration = (length, unit) => {
  return Duration.apply(length, unit);
};

Duration.fromNanos = (nanos) => {
  return Duration.apply(nanos, Units.Nanoseconds);
};

Duration.apply = (length, unit) => {
  class Duration {
    constructor(length, unit, nanos) {
      if (typeof length !== 'number') {
        throw Error('length must be a number');
      }

      this.length = length;
      this.unit = unit;
      this._nanos = nanos;
    }

    toUnit(unit) {
      if (this.length === 0 || this.unit === unit) {
        return this.length;
      }

      switch (unit) {
        case Units.Nanoseconds:
          return this._nanos;
        case Units.Microseconds:
          return this._nanos / 1000;
        case Units.Milliseconds:
          return this._nanos / m2;
        case Units.Seconds:
          return this._nanos / m3;
        case Units.Minutes:
          return this._nanos / m3 / 60;
        case Units.Hours:
          return this._nanos / m3 / 3600;
        case Units.Days:
          return this._nanos / m3 / 3600 / 24;
      }
    }

    toDays() {
      return this.toUnit(Units.Days);
    }

    toHours() {
      return this.toUnit(Units.Hours);
    }

    toMicros() {
      return this.toUnit(Units.Microseconds);
    }

    toMillis() {
      return this.toUnit(Units.Milliseconds);
    }

    toMinutes() {
      return this.toUnit(Units.Minutes);
    }

    toNanos() {
      return this.toUnit(Units.Nanoseconds);
    }

    toSeconds() {
      return this.toUnit(Units.Seconds);
    }

    isFinite() {
      return this.length !== Number.NEGATIVE_INFINITY && this.length !== Number.POSITIVE_INFINITY;
    }
  }

  return new Duration(length, unit, toNanos(length, unit));

  function toNanos(length, unit) {
    if (length === 0 || unit === Units.Nanoseconds) {
      return length;
    }

    switch (unit) {
      case Units.Microseconds:
        return length * 1000;
      case Units.Milliseconds:
        return length * m2;
      case Units.Seconds:
        return length * m3;
      case Units.Minutes:
        return length * m3 * 60;
      case Units.Hours:
        return length * m3 * 3600;
      case Units.Days:
        return length * m3 * 3600 * 24;
    }
  }
};

Duration.Unit = Units;

Duration.Inf = Duration(Number.POSITIVE_INFINITY, Units.Days);
Duration.MinusInf = Duration(Number.NEGATIVE_INFINITY, Units.Days);
Duration.Zero = Duration(0, Units.Days);
