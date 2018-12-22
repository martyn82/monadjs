import {Option, Some, None} from 'util/option';

describe('Option', () => {
  test('Option(undefined) is equal to None', () => {
    expect(Option(undefined)).toBe(None);
  });

  test('Option(null) is equal to None', () => {
    expect(Option(null)).toBe(None);
  });

  test('Option("") is equal to Some("")', () => {
    expect(Option("")).toEqual(Some(""));
  });

  test('Option("foo") is not equal to Some("")', () => {
    expect(Option("foo")).not.toEqual(Some(""));
  });

  test('Option("foo") is equal to Some("foo")', () => {
    expect(Option("foo")).toEqual(Some("foo"));
  });

  test('Option("foo").orElse("bar") is equal to Some("foo")', () => {
    expect(Option("foo").orElse("bar")).toEqual(Some("foo"));
  });
});

describe('None', () => {
  test('None is empty', () => {
    expect(None.isEmpty).toBe(true);
    expect(None.nonEmpty).toBe(false);
  });

  test('None.get throws an error', () => {
    expect(() => None.get()).toThrow('None.get');
  });

  test('None.map does not get called', () => {
    expect(None.map(() => true)).toEqual(None);
  });

  test('None.foreach does not get called', () => {
    let called = false;
    expect(None.foreach(() => called = true)).toBeUndefined();
    expect(called).toBe(false);
  });

  test('None.getOrElse returns the default value', () => {
    expect(None.getOrElse('foo')).toEqual('foo');
  });

  test('None.orElse("bar") is equal to Some("bar")', () => {
    expect(None.orElse('bar')).toEqual(Some("bar"));
  });
});

describe('Some', () => {
  test('Some("") is not empty', () => {
    expect(Some('').isEmpty).toBe(false);
    expect(Some('').nonEmpty).toBe(true);
  });

  test('Some("foo").get retrieves the boxed value', () => {
    expect(Some('foo').get()).toEqual('foo');
  });

  test('Some("foo").map maps the boxed value', () => {
    expect(Some('foo').map(() => 'bar').get()).toEqual(Some('bar').get());
  });

  test('Some("foo").foreach iterates once with boxed value', () => {
    let called = false;
    expect(Some('foo').foreach(() => called = true)).toBeUndefined();
    expect(called).toBe(true);
  });

  test('Some("foo").getOrElse returns the boxed value', () => {
    expect(Some('foo').getOrElse('bar')).toEqual('foo');
  });

  test('Some("foo").orElse("bar") to equal Some("foo")', () => {
    expect(Some("foo").orElse("bar")).toEqual(Some("foo"));
  });
});
