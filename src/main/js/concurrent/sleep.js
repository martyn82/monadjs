
function sleep(duration) {
  return new Promise((resolve, _) => setTimeout(_ => resolve(), duration));
}

exports.sleep = sleep;
