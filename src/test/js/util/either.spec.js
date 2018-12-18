const {Left, Right} = require('util/either');
const {None, Some} = require('util/option');

describe('Left', () => {
  test('Left.isLeft returns true', () => {
    expect(Left('foo').isLeft).toBe(true);
  });

  test('Left.isRight returns false', () => {
    expect(Left('foo').isRight).toBe(false);
  });

  test('Left.exists("foo") returns false', () => {
    expect(Left("foo").exists(() => 1 == 1)).toBe(false);
  });

  test('Left.forall("foo") returns true', () => {
    let called = false;
    expect(Left("foo").forall(() => called = true)).toBe(true);
    expect(called).toBe(false);
  });

  test('Left.fold(l, r) will call l and not r', () => {
    let lCalled = false;
    let rCalled = false;
    expect(Left("foo").fold(() => lCalled = true, () => rCalled = true)).toBe(true);
    expect(lCalled).toBe(true);
    expect(rCalled).toBe(false);
  });

  test('Left.foreach(f) will not be called', () => {
    let called = false;
    expect(Left("foo").foreach(() => called = true)).toBeUndefined();
    expect(called).toBe(false);
  });

  test('Left.map(f) will not be called', () => {
    let called = false;
    expect(Left("foo").map(() => called = true)).toEqual(Left("foo"));
    expect(called).toBe(false);
  });

  test('Left.getOrElse("bar") will return "bar"', () => {
    expect(Left("foo").getOrElse("bar")).toEqual("bar");
  });

  test('Left.swap() returns a Right', () => {
    expect(Left("foo").swap()).toEqual(Right("foo"));
  });

  test('Left.toOption() returns None', () => {
    expect(Left("foo").toOption()).toEqual(None);
  });
});

describe('Right', () => {
  test('Right.isLeft returns false', () => {
    expect(Right('foo').isLeft).toBe(false);
  });

  test('Right.isRight returns true', () => {
    expect(Right('foo').isRight).toBe(true);
  });

  test('Right.exists("foo") returns true if predicate is true', () => {
    expect(Right("foo").exists(() => 1 == 1)).toBe(true);
  });

  test('Right.forall("foo") returns true if predicate holds', () => {
    let called = false;
    expect(Right("foo").forall(() => called = true)).toBe(true);
    expect(called).toBe(true);
  });

  test('Right.fold(l, r) will call r and not l', () => {
    let lCalled = false;
    let rCalled = false;
    expect(Right("foo").fold(() => lCalled = true, () => rCalled = true)).toBe(true);
    expect(lCalled).toBe(false);
    expect(rCalled).toBe(true);
  });

  test('Right.foreach(f) will be called', () => {
    let called = false;
    expect(Right("foo").foreach(() => called = true)).toBeUndefined();
    expect(called).toBe(true);
  });

  test('Right.map(f) will not be called', () => {
    let called = false;
    expect(Right("foo").map(() => called = true)).toEqual(Right(true));
    expect(called).toBe(true);
  });

  test('Right("foo").getOrElse("bar") will return "foo"', () => {
    expect(Right("foo").getOrElse("bar")).toEqual("foo");
  });

  test('Right.swap() returns a Left', () => {
    expect(Right("foo").swap()).toEqual(Left("foo"));
  });

  test('Right.toOption() returns Some', () => {
    expect(Right("foo").toOption()).toEqual(Some("foo"));
  });
});
