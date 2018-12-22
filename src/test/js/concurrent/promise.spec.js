const {Promise} = require('concurrent/promise');
const {Future} = require('concurrent/future');
const {Try, Success, Failure} = require('util/try');

describe('Promise', () => {
  test('fromTry returns a successful Future when Try succeeds', () => {
    const p = Promise.fromTry(Try(() => 'foo'));
    expect(p).toEqual(Promise(Future.successful('foo')));
  });

  test('fromTry returns a failed Future when Try fails', () => {
    const p = Promise.fromTry(Try(() => { throw Error('bla'); }));
    expect(p).toEqual(Promise(Future.failed(Error('bla'))));
  });

  test('Promise.future retrieves the Future underlying the Promise', () => {
    const p = Promise.fromTry(Try(() => 'foo'));
    expect(p.future).toEqual(Future(Success('foo')));
  });

  test('isCompleted reflects underlying Future\'s isCompleted', done => {
    expect.assertions(3);

    const p = Promise();
    expect(p.isCompleted()).toBe(false);

    p.future.onComplete(result => {
      expect(p.isCompleted()).toBe(true);
      expect(result).toEqual(Success('foo'));
      done();
    });

    p.complete(Try(() => 'foo'));
  });

  test('success completes the promise with success', () => {
    const p = Promise();
    expect(p.success('foo')).toEqual(p);
  });

  test('completing an already completed Promise gives an error', () => {
    const p = Promise();
    p.success('foo');

    expect(p.isCompleted()).toBe(true);
    expect(() => p.complete(Success('bar'))).toThrow(Error('Promise already completed'));
  });

  test('tryComplete tries to complete the Promise with the given Try', done => {
    expect.assertions(3);

    const p = Promise();

    expect(p.tryComplete(Try(() => 'foo'))).toBe(true);
    expect(p.isCompleted()).toBe(true);

    p.future.onComplete(result => {
      expect(result).toEqual(Success('foo'));
      done();
    });
  });

  test('tryComplete returns false if the Promise is already completed', () => {
    const p = Promise();
    p.success('foo');

    expect(p.tryComplete(Try(() => 'bar'))).toBe(false);
  });

  test('trySuccess tries to complete the Promise with success and returns true if so', () => {
    const p = Promise();

    expect(p.trySuccess('foo')).toBe(true);
  });

  test('trySuccess returns false if the Promise is already completed', () => {
    const p = Promise();
    p.success('foo');

    expect(p.trySuccess('bar')).toBe(false);
  });

  test('failure completes the Promise with an error', () => {
    const p = Promise();

    expect(p.failure(Error('foo'))).toEqual(p);
  });

  test('failing an already completed Promise gives an error', () => {
    const p = Promise();
    p.failure(Error('foo'));

    expect(() => p.failure(Error('bar'))).toThrow(Error('Promise already completed'));
  });

  test('tryFailure tries to complete the Promise with the given error', () => {
    const p = Promise();

    expect(p.tryFailure(Error('foo'))).toBe(true);
  });

  test('tryFailure returns false if the Promise is already completed', () => {
    const p = Promise();
    p.failure(Error('foo'));

    expect(p.tryFailure(Error('bar'))).toBe(false);
  });

  test('completeWith completes the Promise with the given Future once that Future is completed', () => {
    const p = Promise();

    expect(p.completeWith(Future(() => 'foo'))).toEqual(p);
  });

  test('tryCompleteWith tries to complete the Promise with the given Future once that Future is completed', () => {
    const p = Promise();

    expect(p.tryCompleteWith(Future(() => 'foo'))).toEqual(p);
  });

  test('Promise integration', done => {
    expect.assertions(3);

    const p = Promise();
    const f = p.future;

    Future(() => {
      const product = 'foo';
      p.success(product);
    });

    Future(() => {
      f.foreach(product => {
        expect(product).toBe('foo');
        expect(f.isCompleted).toBe(true);
        expect(p.isCompleted()).toBe(true);
        done();
      });
    });
  });
});
