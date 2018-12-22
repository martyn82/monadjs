import {Some, None} from 'utils';
import {PartialFunction} from 'partialfunction';

describe('PartialFunction', () => {
  test('isDefinedAt returns true if a function exists to handle a value', () => {
    const isEven = PartialFunction(
      n => { if (n % 2 === 0) return true; }
    );

    expect(isEven.isDefinedAt(2)).toBe(true);
    expect(isEven.isDefinedAt(1)).toBe(false);
  });

  test('andThen composes one PartialFunction from a PartialFunctions and a plain function', () => {
    const isEven = PartialFunction(
      n => { if (n % 2 === 0) return 'even'; }
    );
    const isOdd = n => { if (n % 2 !== 0) return 'odd'; };

    const oddOrEven = isEven.andThen(isOdd);

    expect(oddOrEven.apply(2)).toBe('even');
    expect(oddOrEven.apply(1)).toBe('odd');
  });

  test('apply executes the PartialFunction on an input', () => {
    const isEven = PartialFunction(
      n => { if (n % 2 === 0) return 'even'; }
    );

    expect(isEven.apply(2)).toBe('even');
  });

  test('apply throws an error if no suitable function can be applied', () => {
    const isEven = PartialFunction(
      n => { if (n % 2 === 0) return 'even'; }
    );

    expect(() => isEven.apply(1)).toThrow(Error('Match error: 1'));
  });

  test('applyOrElse composes one PartialFunction with a fallback function', () => {
    const two = PartialFunction(n => {
      if (n === 2) return 'two';
    });
    const three = n => {
      if (n === 3) return 'three';
    };

    expect(two.applyOrElse(2, three)).toBe('two');
    expect(two.applyOrElse(3, three)).toBe('three');
  });

  test('applyOrElse on a AndThen is composed with fallback function', () => {
    const two = PartialFunction(n => {
      if (n === 2) return 'two';
    });
    const three = n => {
      if (n === 3) return 'three';
    };
    const four = n => { if (n === 4) return 'four'; };
    const twoThreeOrFour = two.andThen(three);

    expect(twoThreeOrFour.applyOrElse(2, four)).toBe('two');
    expect(twoThreeOrFour.applyOrElse(3, four)).toBe('three');
    expect(twoThreeOrFour.applyOrElse(4, four)).toBe('four');
  });

  test('orElse composes a PartialFunction out of two', () => {
    const one = PartialFunction(n => { if (n === 1) return 'one'; });
    const two = PartialFunction(n => { if (n === 2) return 'two'; });

    const oneOrTwo = one.orElse(two);

    expect(oneOrTwo.apply(1)).toBe('one');
    expect(oneOrTwo.apply(2)).toBe('two');
    expect(oneOrTwo.applyOrElse(3, n => { if (n === 3) return 'three'; })).toBe('three');
  });

  test('orElse in conjunction with andThen', () => {
    const one = PartialFunction(n => { if (n === 1) return 'one'; });
    const two = PartialFunction(n => { if (n === 2) return 'two'; });
    const three = n => { if (n === 3) return 'three'; };
    const four = n => { if (n === 4) return 'four'; };

    const oneOrTwoOrThree = one.orElse(two).andThen(three);

    expect(oneOrTwoOrThree.applyOrElse(1, four)).toBe('one');
    expect(oneOrTwoOrThree.applyOrElse(2, four)).toBe('two');
    expect(oneOrTwoOrThree.applyOrElse(3, four)).toBe('three');
    expect(oneOrTwoOrThree.applyOrElse(4, four)).toBe('four');
  });

  test('lift gives a PartialFunction that lifts the results in an Option', () => {
    const one = PartialFunction(n => { if (n === 1) return 'one'; });

    expect(one.lift().apply(1)).toEqual(Some('one'));
    expect(one.lift().apply(2)).toEqual(None);
  });
});
