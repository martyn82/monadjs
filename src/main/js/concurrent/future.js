import {Success, Failure, Some, None} from './../utils';

const _promise = global.Promise;

export const Future = (f) => {
  if (typeof f === 'undefined') {
    return;
  }

  return Future.apply(f);
};

Future.successful = (value) => Future.apply(Success(value));
Future.undefined = () => Future.apply(Success());
Future.failed = (reason) => Future.apply(Failure(reason));

Future.apply = (f) => {
  class Future {
    constructor(promise) {
      this.value = None;
      this.isCompleted = false;
      this._promise = promise;
      this._promise.then(
        result => {
          this.isCompleted = true;
          this.value = Some(result);
        },
        err => {
          this.isCompleted = true;
          this.value = Some(err);
        }
      ).catch(() => {}).finally(() => this.isCompleted = true);
    }

    onComplete(f) {
      let completed = result => {
        f(result);
      };
      this._promise.then(result => completed(result), reason => completed(reason));
    }

    foreach(f) {
      this._promise.then(result => { f(result.get()); });
    }

    map(f) {
      return new Future(
        new _promise((resolve, reject) => {
          this._promise.then(
            result => {resolve(Success(f(result.get())))},
            error => {reject(Failure(error))}
          );
        })
      );
    }

    async ready(duration) {
      await wait.call(this, duration);
      return this;
    }

    async result(duration) {
      await wait.call(this, duration);
      return this.value.map(v => v.get()).getOrElse(undefined);
    }
  }

  let promise;

  const _future = (f) => {
    switch (f.constructor.name) {
      case 'AsyncFunction':
        promise = f().then(v => resolveTry(v, Success.apply),
                           e => resolveTry(e, Failure.apply)
        ).catch(e => resolveTry(e, Failure.apply));
        break;

      case 'Success':
        promise = new _promise((resolve, _) => {
          resolve(f());
        });
        break;

      case 'Failure':
        promise = new _promise((_, reject) => {
          reject(f());
        });
        break;

      default:
        promise = new _promise((resolve, reject) => {
          try {
            const result = f();
            resolve(resolveTry(result, Success.apply));
          } catch (e) {
            reject(resolveTry(e, Failure.apply));
          }
        });
        break;
    }

    return new Future(promise);

    function resolveTry(value, f) {
      switch (value.constructor.name) {
        case 'Success':
        case 'Failure':
          return value;

        default:
          return f(value);
      }
    }
  };

  return _future(f);
};


async function wait(atMost) {
  let timer;
  async function _wait(atMost) {
    function timeout(duration) {
      return new _promise((_, reject) => {
        timer = setTimeout(() => {
          reject(Error('Futures timed out after ' + duration));
        }, duration.toMillis());
      });
    }

    return await timeout(atMost);
  }

  this.onComplete(() => clearTimeout(timer));
  return await _promise.race([this._promise, _wait(atMost)]);
}
