import {Future, Await, sleep} from 'concurrent';
import {Success, Failure} from 'utils';

describe('Await', () => {
  test('Await.ready throws an error if argument is not awaitable', () => {
    expect(() => Await.ready({}, 1)).toThrow(Error);
  });

  test('Await.ready waits for the awaitable to be completed', async done => {
    expect.assertions(1);

    const f = Future(async () => {
      await sleep(10);
      return 'foo';
    });

    (await Await.ready(f, 11)).onComplete(result => {
      expect(result).toEqual(Success('foo'));
      done();
    });
  });

  test('Await.ready throws an error if the given timeout is passed', async () => {
    expect.assertions(1);

    const f = Future(async () => {
      await sleep(100);
      return 'foo';
    });

    const patience = 10;

    try {
      await Await.ready(f, 10);
    } catch (e) {
      expect(e).toEqual(Error('Futures timed out after ' + patience))
    }
  });

  test('Await.result throws an error if argument is not awaitable', () => {
    expect(() => Await.result({}, 1)).toThrow(Error);
  });

  test('Await.result waits for the awaitable to be completed and returns the value if successful', async () => {
    const f = Future(async () => {
      await sleep(10);
      return 'foo';
    });

    expect(await Await.result(f, 11)).toEqual('foo');
  });

  test('Await.result waits for the awaitable to be completed and throws the error if failed', async () => {
    expect.assertions(1);

    const f = Future(async () => {
      await sleep(10);
      throw Error('foo');
    });

    try {
      await Await.result(f, 11);
    } catch (e) {
      expect(e).toEqual(Error('foo'));
    }
  });

  test('Await.result throws an error if the given timeout is passed', async () => {
    expect.assertions(1);

    const f = Future(async () => {
      await sleep(100);
      return 'foo';
    });

    const patience = 10;

    try {
      await Await.result(f, patience);
    } catch (e) {
      expect(e).toEqual(Error('Futures timed out after ' + patience));
    }
  });
});
