const {Some, None} = require('util/option');
const {Success, Failure} = require('util/try');

/*

        // async function ready(value) {
        //   function timer(value) {
        //     return new _promise((resolve, _) => {
        //       const t = setInterval(value => {
        //         if (value.value) {
        //           clearInterval(t);
        //           resolve(value.value);
        //         }
        //       }, 1, value);
        //     });
        //   }
        //   return await timer(value);
        // }
        // return await ready(this._value);

 */

const _promise = window.Promise;

const Future = (f) => {
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
  }

  let promise;

  switch (f.constructor.name) {
    case 'AsyncFunction':
      promise = f();
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
          resolve(Success(result));
        } catch (e) {
          reject(Failure(e));
        }
      });
      break;
  }

  return new Future(promise);
};

module.exports = {Future};
