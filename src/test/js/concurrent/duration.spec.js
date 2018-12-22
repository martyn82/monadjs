import {Duration} from 'concurrent';

describe('Duration', () => {
  test('duration can be created by length and unit', () => {
    const d = Duration(1, Duration.Unit.Nanoseconds);
    expect(d.length).toBe(1);
    expect(d.unit).toBe(Duration.Unit.Nanoseconds);
  });

  test('Zero represents a duration of zero days', () => {
    const z = Duration.Zero;
    expect(z.length).toBe(0);
    expect(z.unit).toBe(Duration.Unit.Days);
  });

  test('Inf represents an infinite duration', () => {
    const inf = Duration.Inf;
    expect(inf.length).toBe(Number.POSITIVE_INFINITY);
    expect(inf.unit).toBe(Duration.Unit.Days);
  });

  test('MinusInf represents an infinite negative duration', () => {
    const minf = Duration.MinusInf;
    expect(minf.length).toBe(Number.NEGATIVE_INFINITY);
    expect(minf.unit).toBe(Duration.Unit.Days);
  });

  test('fromNanos creates a Duration from nanoseconds', () => {
    expect(Duration.fromNanos(1)).toEqual(Duration(1, Duration.Unit.Nanoseconds));
  });

  test('isFinite returns true if the duration is finite', () => {
    expect(Duration(1, Duration.Unit.Hours).isFinite()).toBe(true);
  });

  test('isFinite returns false if the duration is infinite', () => {
    expect(Duration.Inf.isFinite()).toBe(false);
    expect(Duration.MinusInf.isFinite()).toBe(false);
  });
});

describe('Duration conversion', () => {
  const _ = Duration.Unit;

  describe('Nanoseconds', () => {
    let d;
    beforeEach(() => d = Duration(1, _.Nanoseconds));

    test('Convert nanoseconds to nanoseconds', () => expect(d.toUnit(_.Nanoseconds)).toBe(d.length));
    test('Convert nanoseconds to microseconds', () => expect(d.toUnit(_.Microseconds)).toBe(d.length / 1000));
    test('Convert nanoseconds to milliseconds', () => expect(d.toUnit(_.Milliseconds)).toBe(d.length / Math.pow(1000, 2)));
    test('Convert nanoseconds to seconds', () => expect(d.toUnit(_.Seconds)).toBe(d.length / Math.pow(1000, 3)));
    test('Convert nanoseconds to minutes', () => expect(d.toUnit(_.Minutes)).toBe(d.length / Math.pow(1000, 3) / 60));
    test('Convert nanoseconds to hours', () => expect(d.toUnit(_.Hours)).toBe(d.length / Math.pow(1000, 3) / 3600));
    test('Convert nanoseconds to days', () => expect(d.toUnit(_.Days)).toBe(d.length / Math.pow(1000, 3) / 3600 / 24));
  });

  describe('Microseconds', () => {
    let d;
    beforeEach(() => d = Duration(1, _.Microseconds));

    test('Convert microseconds to nanoseconds', () => expect(d.toUnit(_.Nanoseconds)).toBe(d.length * 1000));
    test('Convert microseconds to microseconds', () => expect(d.toUnit(_.Microseconds)).toBe(d.length));
    test('Convert microseconds to milliseconds', () => expect(d.toUnit(_.Milliseconds)).toBe(d.length / 1000));
    test('Convert microseconds to seconds', () => expect(d.toUnit(_.Seconds)).toBe(d.length / Math.pow(1000, 2)));
    test('Convert microseconds to minutes', () => expect(d.toUnit(_.Minutes)).toBe(d.length / Math.pow(1000, 2) / 60));
    test('Convert microseconds to hours', () => expect(d.toUnit(_.Hours)).toBe(d.length / Math.pow(1000, 2) / 3600));
    test('Convert microseconds to days', () => expect(d.toUnit(_.Days)).toBe(d.length / Math.pow(1000, 2) / 3600 / 24));
  });

  describe('Milliseconds', () => {
    let d;
    beforeEach(() => d = Duration(1, _.Milliseconds));

    test('Convert milliseconds to nanoseconds', () => expect(d.toUnit(_.Nanoseconds)).toBe(d.length * Math.pow(1000, 2)));
    test('Convert milliseconds to microseconds', () => expect(d.toUnit(_.Microseconds)).toBe(d.length * 1000));
    test('Convert milliseconds to milliseconds', () => expect(d.toUnit(_.Milliseconds)).toBe(d.length));
    test('Convert milliseconds to seconds', () => expect(d.toUnit(_.Seconds)).toBe(d.length / 1000));
    test('Convert milliseconds to minutes', () => expect(d.toUnit(_.Minutes)).toBe(d.length / 1000 / 60));
    test('Convert milliseconds to hours', () => expect(d.toUnit(_.Hours)).toBe(d.length / 1000 / 3600));
    test('Convert milliseconds to days', () => expect(d.toUnit(_.Days)).toBe(d.length / 1000 / 3600 / 24));
  });

  describe('Seconds', () => {
    let d;
    beforeEach(() => d = Duration(1, _.Seconds));

    test('Convert seconds to nanoseconds', () => expect(d.toUnit(_.Nanoseconds)).toBe(d.length * Math.pow(1000, 3)));
    test('Convert seconds to microseconds', () => expect(d.toUnit(_.Microseconds)).toBe(d.length * Math.pow(1000, 2)));
    test('Convert seconds to milliseconds', () => expect(d.toUnit(_.Milliseconds)).toBe(d.length * 1000));
    test('Convert seconds to seconds', () => expect(d.toUnit(_.Seconds)).toBe(d.length));
    test('Convert seconds to minutes', () => expect(d.toUnit(_.Minutes)).toBe(d.length / 60));
    test('Convert seconds to hours', () => expect(d.toUnit(_.Hours)).toBe(d.length / 3600));
    test('Convert seconds to days', () => expect(d.toUnit(_.Days)).toBe(d.length / 3600 / 24));
  });

  describe('Minutes', () => {
    let d;
    beforeEach(() => d = Duration(1, _.Minutes));

    test('Convert minutes to nanoseconds', () => expect(d.toUnit(_.Nanoseconds)).toBe(d.length * Math.pow(1000, 3) * 60));
    test('Convert minutes to microseconds', () => expect(d.toUnit(_.Microseconds)).toBe(d.length * Math.pow(1000, 2) * 60));
    test('Convert minutes to milliseconds', () => expect(d.toUnit(_.Milliseconds)).toBe(d.length * 1000 * 60));
    test('Convert minutes to seconds', () => expect(d.toUnit(_.Seconds)).toBe(d.length * 60));
    test('Convert minutes to minutes', () => expect(d.toUnit(_.Minutes)).toBe(d.length));
    test('Convert minutes to hours', () => expect(d.toUnit(_.Hours)).toBe(d.length / 60));
    test('Convert minutes to days', () => expect(d.toUnit(_.Days)).toBe(d.length / 60 / 24));
  });

  describe('Hours', () => {
    let d;
    beforeEach(() => d = Duration(1, _.Hours));

    test('Convert hours to nanoseconds', () => expect(d.toUnit(_.Nanoseconds)).toBe(d.length * Math.pow(1000, 3) * 3600));
    test('Convert hours to microseconds', () => expect(d.toUnit(_.Microseconds)).toBe(d.length * Math.pow(1000, 2) * 3600));
    test('Convert hours to milliseconds', () => expect(d.toUnit(_.Milliseconds)).toBe(d.length * 1000 * 3600));
    test('Convert hours to seconds', () => expect(d.toUnit(_.Seconds)).toBe(d.length * 3600));
    test('Convert hours to minutes', () => expect(d.toUnit(_.Minutes)).toBe(d.length * 60));
    test('Convert hours to hours', () => expect(d.toUnit(_.Hours)).toBe(d.length));
    test('Convert hours to days', () => expect(d.toUnit(_.Days)).toBe(d.length / 24));
  });

  describe('Days', () => {
    let d;
    beforeEach(() => d = Duration(1, _.Days));

    test('Convert days to nanoseconds', () => expect(d.toUnit(_.Nanoseconds)).toBe(d.length * Math.pow(1000, 3) * 3600 * 24));
    test('Convert days to microseconds', () => expect(d.toUnit(_.Microseconds)).toBe(d.length * Math.pow(1000, 2) * 3600 * 24));
    test('Convert days to milliseconds', () => expect(d.toUnit(_.Milliseconds)).toBe(d.length * 1000 * 3600 * 24));
    test('Convert days to seconds', () => expect(d.toUnit(_.Seconds)).toBe(d.length * 3600 * 24));
    test('Convert days to minutes', () => expect(d.toUnit(_.Minutes)).toBe(d.length * 60 * 24));
    test('Convert days to hours', () => expect(d.toUnit(_.Hours)).toBe(d.length * 24));
    test('Convert days to days', () => expect(d.toUnit(_.Days)).toBe(d.length));
  });
});
