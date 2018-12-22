const {Future} = require('concurrent/future');
const {Success, Failure} = require('util/try');
const {Some, None} = require('util/option');

describe('Future', () => {
  test('onComplete is called with the result when the future is complete', done => {
    expect.assertions(1);

    const future = Future(() => 'completed');
    future.onComplete(result => {
      expect(result).toEqual(Success('completed'));
      done();
    });

    return future._promise;
  });

  test('onComplete is called with the error when the future is complete', done => {
    expect.assertions(1);

    const future = Future(() => { throw new Error('foo'); });
    future.onComplete(result => {
      expect(result).toEqual(Failure(Error('foo')));
      done();
    });

    return future._promise;
  });

  test('onComplete can be used in conjunction with other callbacks', done => {
    expect.assertions(2);
    let handles = 0;

    const future = Future(() => 'completed');
    future.onComplete(result => {
      expect(result).toEqual(Success('completed'));
      handles++;

      if (handles === 2) done();
    });
    future.foreach(result => {
      expect(result).toEqual('completed');
      handles++;

      if (handles === 2) done();
    });

    return future._promise;
  });

  test('foreach is called with the unboxed Success value', done => {
    expect.assertions(1);

    const future = Future(() => 'completed');
    future.foreach(result => {
      expect(result).toEqual('completed');
      done();
    });

    return future._promise;
  });

  test('isCompleted indicates whether the future is completed', done => {
    expect.assertions(2);

    const future = Future(async () => await sleep(100));
    expect(future.isCompleted).toBe(false);

    future.onComplete(_ => {
      expect(future.isCompleted).toBe(true);
      done();
    });
  });

  test('value of a not completed Future is None', () => {
    const future = Future(() => 'foo');
    expect(future.value).toEqual(None);
  });

  test('value of a successful Future is Some(Success())', done => {
    const future = Future(() => 'foo');
    future.foreach(_ => {
      expect(future.value).toEqual(Some(Success('foo')));
      done();
    });

    return future._promise;
  });

  test('value of a Future stays in tact if onComplete handler is registered', done => {
    expect.assertions(1);

    const future = Future(() => 'foo');
    future.onComplete(result => {
      expect(future.value).toEqual(Some(Success('foo')));
      done();
    });

    return future._promise;
  });

  test('value of a failed Future is Some(Failure())', done => {
    const future = Future(() => { throw new Error('foo'); });
    future.onComplete(() => {
      expect(future.value).toEqual(Some(Failure(Error('foo'))));
      done();
    });

    return future._promise;
  });

  test('map will create a new Future by applying f to the successful result', done => {
    const f1 = Future(() => 'foo');
    const f2 = f1.map(result => {
      expect(result).toEqual('foo');
      return 'bar';
    });

    f2.onComplete(result => {
      expect(result).toEqual(Success('bar'));
      done();
    });

    return f2._promise;
  });

  test('Future.successful returns an immediate successful Future with a boxed value', () => {
    expect(Future.successful('foo')).toEqual(Future(Success('foo')));
  });

  test('Future.unit returns an immediate successful Future with undefined', () => {
    expect(Future.undefined()).toEqual(Future(Success(undefined)));
  });

  test('Future.failed returns an immediate failed Future with a boxed reason', () => {
    expect(Future.failed(Error('bar'))).toEqual(Future(Failure(Error('bar'))));
  });
});
