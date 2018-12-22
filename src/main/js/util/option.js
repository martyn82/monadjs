
/* None */

const None = {
  isEmpty: true,
  nonEmpty: false,

  get() {
    throw new Error('None.get');
  },

  getOrElse(defaultValue) {
    return defaultValue;
  },

  orElse(defaultValue) {
    return Some(defaultValue);
  },

  map(f) {
    return None;
  },

  foreach(f) {
    // no-op
  }
};

/* Some */

const Some = (value) => {
  return Some.apply(value);
};

Some.apply = (value) => {
  class Some {
    constructor(value) {
      this.value = value;
      this.isEmpty = false;
      this.nonEmpty = true;
    }

    get() {
      return this.value;
    }

    getOrElse(defaultValue) {
      return this.value;
    }

    orElse(defaultValue) {
      return this;
    }

    map(f) {
      return new Some(f(this.value));
    }

    foreach(f) {
      f(this.value);
    }
  }

  return new Some(value);
};

/* Option */

const Option = (value) => {
  return Option.apply(value);
};

Option.apply = (value) => {
  if (typeof value === 'undefined' || value === null) {
    return None;
  } else {
    return Some(value);
  }
};

export {Option, Some, None};
