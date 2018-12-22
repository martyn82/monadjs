import {Future} from 'concurrent/future';
import {Success, Failure} from 'utils';

const _promise = window.Promise;

export const Promise = () => {
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
      this._data = {value: undefined};
      this._proxy = this._data;
      this.future = Future( async () => {
        return new _promise((resolve, _) => {
          this._proxy = new Proxy(this._data, {
            set: (obj, prop, val) => {
              obj[prop] = val;
              this._isCompleted = true;
              resolve(val);
              return true;
            },
            get: (obj, prop) => {
              return obj[prop];
            }
          });
        });
      });
      this._isCompleted = this.future.isCompleted;
    }

    isCompleted() {
      return this._isCompleted;
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
        if (value !== null) {
          this._proxy.value = value;
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

    failure(reason) {
      return this.complete(Failure(reason));
    }

    tryFailure(reason) {
      return this.tryComplete(Failure(reason));
    }

    completeWith(future) {
      return this.tryCompleteWith(future);
    }

    tryCompleteWith(future) {
      if (future !== this.future) {
        future.onComplete(result => this.tryComplete(result));
      }
      return this;
    }
  }

  return new Promise();
};
