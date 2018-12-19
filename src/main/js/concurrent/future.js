const {Some, None} = require('util/option');
const {Success, Failure} = require('util/try');

const Future = (f) => {
  return Future.apply(f);
};

Future.apply = (f) => {
  class Future {
    constructor(promise) {
      this.promise = promise;
      this.isCompleted = false;
      this.completed = _ => {};
      this.value = None;
      this.promise.then(
        result => this.value = Some(result),
        err => this.value = Some(err)
      ).catch(_ => _).finally(_ => this.isCompleted = true);
    }

    onComplete(f) {
      this.completed = result => {
        this.isCompleted = true;
        f(result);
      };
      this.promise.then(result => this.completed(result), reason => this.completed(reason));
    }

    foreach(f) {
      this.promise.then(result => { f(result.get()); });
    }

    map(f) {
      return new Future(
        new Promise((resolve, reject) => {
          this.promise.then(
            result => {resolve(Success(f(result.get())))},
            error => {reject(Failure(error))}
          );
        })
      );
    }
  }

  const promise = (f.constructor.name === 'AsyncFunction') ? f() : new Promise((resolve, reject) => {
    try {
      const result = f();
      resolve(Success(result));
    } catch (e) {
      reject(Failure(e));
    }
  });

  return new Future(promise);
};

module.exports = {Future};
