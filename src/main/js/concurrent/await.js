
const _promise = window.Promise;

export const Await = {
  ready: (awaitable, atMost) => {
    if (typeof awaitable.ready === 'function') {
      return awaitable.ready(atMost);
    }

    throw Error('The given Awaitable must implement "ready"');
  },

  result: (awaitable, atMost) => {
    if (typeof awaitable.result === 'function') {
      return awaitable.result(atMost);
    }

    throw Error('The given Awaitable must implement "result"');
  }
};
