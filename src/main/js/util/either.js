const {Some, None} = require('./option');

/* Left */
const Left = (value) => {
  return Left.apply(value);
};

Left.apply = (value) => {
  class Left {
    constructor(value) {
      this.value = value;
      this.isLeft = true;
      this.isRight = false;
    }

    exists(p) {
      return false;
    }

    fold(fa, fb) {
      return fa(this.value);
    }

    foreach(f) {}

    forall(f) {
      return true;
    }

    getOrElse(defaultValue) {
      return defaultValue;
    }

    map(f) {
      return this;
    }

    swap() {
      return Right.apply(value);
    }

    toOption() {
      return None;
    }
  }

  return new Left(value);
};

/* Right */
const Right = (value) => {
  return Right.apply(value);
};

Right.apply = (value) => {
  class Right {
    constructor(value) {
      this.value = value;
      this.isLeft = false;
      this.isRight = true;
    }

    exists(p) {
      return p(this.value);
    }

    fold(fa, fb) {
      return fb(this.value);
    }

    foreach(f) {
      f(this.value);
    }

    forall(f) {
      return f(this.value);
    }

    getOrElse(defaultValue) {
      return this.value;
    }

    map(f) {
      return new Right(f(this.value));
    }

    swap() {
      return Left(this.value);
    }

    toOption() {
      return Some(this.value);
    }
  }

  return new Right(value);
};

module.exports = {Left, Right};
