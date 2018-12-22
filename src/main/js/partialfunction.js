import {None, Option} from "./utils";

export const PartialFunction = (f) => {
  return PartialFunction.apply(f);
};

PartialFunction.apply = (f) => {
  class PartialFunction {
    constructor(f) {
      this._f = f;
    }

    isDefinedAt(x) {
      return this._f(x) !== undefined;
    }

    andThen(k) {
      return new AndThen(this, k);
    }

    apply(x) {
      const result = this._f(x);

      if (typeof result === 'undefined') {
        throw Error('Match error: ' + x);
      }

      return result;
    }

    applyOrElse(x, y) {
      if (this.isDefinedAt(x)) {
        return this.apply(x);
      } else {
        return y(x);
      }
    }

    orElse(that) {
      return new OrElse(this, that);
    }

    lift() {
      return new Lifted(this);
    }
  }

  class OrElse extends PartialFunction {
    constructor(f1, f2) {
      super(x => f1.applyOrElse(x, f2._f));
      this._f1 = f1;
      this._f2 = f2;
    }

    isDefinedAt(x) {
      return this._f1.isDefinedAt(x) || this._f2.isDefinedAt(x);
    }

    apply(x) {
      return super.apply(x);
    }
  }

  class AndThen extends PartialFunction {
    constructor(pf, k) {
      super(x => {
        if (pf.isDefinedAt(x)) {
          return pf.apply(x);
        } else {
          return k(x);
        }
      });
      this._pf = pf;
      this._k = k;
    }

    isDefinedAt(x) {
      return this._pf.isDefinedAt(x);
    }

    applyOrElse(x, y) {
      if (super.isDefinedAt(x)) {
        return super.apply(x);
      } else {
        return y(x);
      }
    }
  }

  class Lifted extends PartialFunction {
    constructor(pf) {
      super(x => {
        try {
          const result = pf._f(x);
          return Option(result);
        } catch (e) {
          return None;
        }
      });
    }
  }

  return new PartialFunction(f);
};
