import {Left, Right} from 'util/either';
import {Some, None} from 'util/option';
import {Try, Success, Failure} from 'util/try';

describe('Try', () => {
  test('Try returns Success if f was successful', () => {
    const f = () => true;

    expect(Try(f).isSuccess).toBe(true);
  });

  test('Success contains return value of f', () => {
    const f = () => true;
    expect(Try(f)).toEqual(Success(true));
  });

  test('Try returns Failure if f throws an exception', () => {
    const f = () => { throw new Error('foo'); };
    expect(Try(f).isFailure).toBe(true);
  });

  test('Failure contains error thrown by f', () => {
    const f = () => { throw new Error('foo'); };
    expect(Try(f)).toEqual(Failure(Error('foo')));
  });
});

describe('Success', () => {
  test('filter() returns identity if predicate was met', () => {
    expect(Success(1).filter(_ => _ === 1)).toEqual(Success(1));
  });

  test('filter() returns Failure if predicate was not met', () => {
    expect(Success(1).filter(_ => _ === 2)).toEqual(Failure(1))
  });

  test('fold() applies fb', () => {
    const fa = jest.fn();
    const fb = jest.fn();

    Success('foo').fold(fa, fb);

    expect(fa).toHaveBeenCalledTimes(0);
    expect(fb).toHaveBeenCalledTimes(1);
  });

  test('foreach applies f', () => {
    const f = jest.fn();
    expect(Success('foo').foreach(f)).toBeUndefined();
    expect(f).toHaveBeenCalledTimes(1);
  });

  test('map applies f', () => {
    const f = jest.fn();
    Success('foo').map(f);
    expect(f).toHaveBeenCalledTimes(1);
  });

  test('map applies f and returns the value', () => {
    const f = () => true;
    expect(Success('foo').map(f)).toEqual(Success(true));
  });

  test('get() retrieves the boxed value', () => {
    expect(Success('foo').get()).toEqual('foo');
  });

  test('getOrElse() retrieves the boxed value', () => {
    expect(Success('foo').getOrElse('bar')).toBe('foo');
  });

  test('orElse() retrieves identity', () => {
    expect(Success('foo').orElse('bar')).toEqual(Success('foo'));
  });

  test('toEither() returns a Right', () => {
    expect(Success('foo').toEither()).toEqual(Right('foo'));
  });

  test('toOption() returns a Some', () => {
    expect(Success('foo').toOption()).toEqual(Some('foo'));
  });
});

describe('Failure', () => {
  test('filter() returns identity', () => {
    expect(Failure(1).filter(_ => _ === 1)).toEqual(Failure(1));
    expect(Failure(1).filter(_ => _ === 2)).toEqual(Failure(1))
  });

  test('fold() applies fa', () => {
    const fa = jest.fn();
    const fb = jest.fn();

    Failure('foo').fold(fa, fb);

    expect(fa).toHaveBeenCalledTimes(1);
    expect(fb).toHaveBeenCalledTimes(0);
  });

  test('foreach does not apply f', () => {
    const f = jest.fn();
    expect(Failure('foo').foreach(f)).toBeUndefined();
    expect(f).toHaveBeenCalledTimes(0);
  });

  test('map does not apply f', () => {
    const f = jest.fn();
    Failure('foo').map(f);
    expect(f).toHaveBeenCalledTimes(0);
  });

  test('map does not apply f and thus returns identity', () => {
    const f = () => true;
    expect(Failure('foo').map(f)).toEqual(Failure('foo'));
  });

  test('get() throws the boxed error', () => {
    expect(() => Failure(Error('foo')).get()).toThrow(Error);
  });

  test('getOrElse() retrieves the default value', () => {
    expect(Failure('foo').getOrElse('bar')).toEqual('bar');
  });

  test('orElse() retrieves the default', () => {
    expect(Failure('foo').orElse(Failure('bar'))).toEqual(Failure('bar'));
  });

  test('toEither() returns a Right', () => {
    expect(Failure('foo').toEither()).toEqual(Left('foo'));
  });

  test('toOption() returns a Some', () => {
    expect(Failure('foo').toOption()).toEqual(None);
  });
});
