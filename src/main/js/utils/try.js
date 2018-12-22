import {Left, Right} from './either';
import {Some, None} from './option';

/* Success */
export const Success = (value) => {
  return Success.apply(value);
};

Success.apply = (value) => {
  class Success {
    constructor(value) {
      this.value = value;
      this.isFailure = false;
      this.isSuccess = true;
    }

    filter(p) {
      return p(this.value) ? this : Failure(this.value);
    }

    fold(fa, fb) {
      return fb(this.value);
    }

    foreach(f) {
      f(this.value);
    }

    get() {
      return this.value;
    }

    getOrElse(defaultValue) {
      return this.value;
    }

    map(f) {
      return new Success(f(this.value));
    }

    orElse(defaultValue) {
      return this;
    }

    toEither() {
      return Right(this.value);
    }

    toOption() {
      return Some(this.value);
    }
  }

  return new Success(value);
};

/* Failure */
export const Failure = (error) => {
  return Failure.apply(error);
};

Failure.apply = (error) => {
  class Failure {
    constructor(error) {
      this.value = error;
      this.isFailure = true;
      this.isSuccess = false;
    }

    filter(p) {
      return this;
    }

    fold(fa, fb) {
      return fa(this.value);
    }

    foreach(f) {}

    get() {
      throw this.value;
    }

    getOrElse(defaultValue) {
      return defaultValue;
    }

    map(f) {
      return this;
    }

    orElse(defaultValue) {
      return defaultValue;
    }

    toEither() {
      return Left(this.value);
    }

    toOption() {
      return None;
    }
  }

  return new Failure(error);
};

/* Try */
export const Try = (f) => {
  return Try.apply(f);
};

Try.apply = (f) => {
  try {
    const result = f();
    return Success(result);
  } catch (e) {
    return Failure(e);
  }
};
