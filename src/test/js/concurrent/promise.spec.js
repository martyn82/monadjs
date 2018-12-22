const {Promise} = require('concurrent/promise');
const {Future} = require('concurrent/future');
const {sleep} = require('concurrent/sleep');
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

  test('completing an already completed Promise gives an error', async () => {
    const p = Promise();
    p.success('foo');

    await sleep(10);

    expect(p.isCompleted()).toBe(true);
    expect(() => p.complete(Success('bar'))).toThrow(Error('Promise already completed'));
  });

  test('tryComplete tries to complete the Promise with the given Try', pending);
  test('tryComplete returns false if the Promise is already completed', pending);

  test('trySuccess tries to complete the Promise with success and returns true if so', pending);
  test('trySuccess returns false if the Promise is already completed', pending);
});
