
const _promise = global.Promise;

export default function sleep(duration) {
  return new _promise((resolve, _) => setTimeout(_ => resolve(), duration.toMillis()));
}
