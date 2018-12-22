import {Duration} from 'concurrent';
import {default as _} from 'concurrent/duration/implicits';

describe('Duration implicits', () => {
  test('Number can be a duration of nanoseconds', () => {
    const d = 1..nanosecond;

    expect(d).toEqual(1..nanoseconds);
    expect(d).toEqual(Duration(1, Duration.Unit.Nanoseconds));
  });

  test('Number can be a duration of microseconds', () => {
    const d = 1..microsecond;

    expect(d).toEqual(1..microseconds);
    expect(d).toEqual(Duration(1, Duration.Unit.Microseconds));
  });

  test('Number can be a duration of milliseconds', () => {
    const d = 1..millisecond;

    expect(d).toEqual(1..milliseconds);
    expect(d).toEqual(Duration(1, Duration.Unit.Milliseconds));
  });

  test('Number can be a duration of seconds', () => {
    const d = 1..second;

    expect(d).toEqual(1..seconds);
    expect(d).toEqual(Duration(1, Duration.Unit.Seconds));
  });

  test('Number can be a duration of minutes', () => {
    const d = 1..minute;

    expect(d).toEqual(1..minutes);
    expect(d).toEqual(Duration(1, Duration.Unit.Minutes));
  });

  test('Number can be a duration of hours', () => {
    const d = 1..hour;

    expect(d).toEqual(1..hours);
    expect(d).toEqual(Duration(1, Duration.Unit.Hours));
  });

  test('Number can be a duration of days', () => {
    const d = 1..day;

    expect(d).toEqual(1..days);
    expect(d).toEqual(Duration(1, Duration.Unit.Days));
  });
});
