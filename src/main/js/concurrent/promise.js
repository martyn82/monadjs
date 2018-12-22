const {Future} = require('concurrent/future');
const {Success, Failure} = require('util/try');

const _promise = window.Promise;

const Promise = () => {
  return Promise.apply();
};

Promise.fromTry = (value) => {
  switch (value.constructor.name) {
    case 'Success':
      return Promise(Future.successful(value));
    case 'Failure':
      return Promise(Future.failed(value));
    default:
      throw new Error('Value must be a Try');
  }
};

Promise.successful = (result) => Promise.fromTry(Success(result));
Promise.failed = (reason) => Promise.fromTry(Failure(reason));

Promise.apply = () => {
  class Promise {
    constructor() {
      this._value = {value: undefined};
      this.future = Future(async () => {
        async function ready(value) {
          function timer(value) {
            return new _promise((resolve, _) => {
              const t = setInterval(value => {
                if (value.value) {
                  clearInterval(t);
                  resolve(value.value);
                }
              }, 1, value);
            });
          }
          return await timer(value);
        }
        return await ready(this._value);
      });
    }

    isCompleted() {
      return this.future.isCompleted;
    }

    complete(value) {
      if (this.tryComplete(value)) {
        return this;
      } else {
        throw new Error('Promise already completed');
      }
    }

    tryComplete(value) {
      if (this.isCompleted()) {
        return false;
      } else {
        if (typeof value.constructor !== 'undefined' && value.constructor.name === 'Failure') {
          return false;
        } else if (value !== null) {
          this._value.value = value;
          return true;
        } else {
          return false;
        }
      }
    }

    success(value) {
      return this.complete(Success(value));
    }

    trySuccess(value) {
      return this.tryComplete(Success(value));
    }

    failure(reason) {}
    tryFailure(reason) {}

    completeWith(future) {}
    tryCompleteWith(future) {}
  }

  return new Promise();
};

module.exports = {Promise};
