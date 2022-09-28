export interface Sequence<T> {
  (n: number): T;
  loopLength?: number;
}
export function interleave<T>(...sequences: Sequence<T>[]): Sequence<T> {
  if (sequences.length === 1) return sequences[0];
  if (sequences.length === 0) {
    throw "Interleave expects at least one argument";
  }

  const combinedSequence: Sequence<T> = (n: number): T => {
    return sequences[n % sequences.length](Math.floor(n / sequences.length));
  };

  // TODO: Calculate the loopLength

  return combinedSequence;
}

/**
 *
 * Create a validator-example-function from a list of literals.
 */
export function listed<T>(...examples: T[]): Sequence<T> {
  let exampleFunction: Sequence<T> = (n: number) => {
    return examples[n % examples.length];
  };
  exampleFunction.loopLength = examples.length;
  return exampleFunction;
}

export function counter(base = 2): (n: number) => number[] {
  return (n) => {
    let arr: number[] = [];
    for (let i = 0; i < n; ++i) {
      let j = 0;
      do {
        arr[j] = ((arr[j] || 0) + 1) % base;
      } while (arr[j++] === 0);
    }
    return arr;
  };
}

export const binaryCount = counter(2);

export function triangleCount(n: number): number[] {
  let arr: number[] = [];
  for (let i = 0; i < n; ++i) {
    let j = 0;
    do {
      arr[j] = ((arr[j] || 0) + 1) % Math.max(arr.length + 1, 2);
    } while (arr[j++] === 0);
  }
  return arr;
}

export function map<T, U>(
  original: Sequence<T>,
  mapFunction: (x: T) => U
): Sequence<U> {
  const exampleFunction = (n: number): U => mapFunction(original(n));
  exampleFunction.loopLength = original.loopLength;
  return exampleFunction;
}

export function concat<T>(...exampleFunctions: Sequence<T>[]): Sequence<T> {
  for (let i = 0; i < exampleFunctions.length - 1; ++i) {
    const f = exampleFunctions[i];
    if (!f || typeof f !== "function") {
      // TODO: Maybe log some kind of warning?
      continue;
    }
    if (
      !(
        typeof f.loopLength === "number" &&
        f.loopLength > 0 &&
        f.loopLength !== Infinity
      )
    )
      throw new Error(
        `Only the last example function passed into concat may have undefined/infinite length. Consider using interleave instead`
      );
    else
      return (n: number): T => {
        let i = 0;
        while (n >= exampleFunctions[i].loopLength) {
          n -= exampleFunctions[i].loopLength;
          i = (i + 1) % exampleFunctions.length;
        }
        return exampleFunctions[i](n);
      };
  }

  // TODO: Add final return or throw
}

/**
 * 2d coordinates along the diagonals of a grid, George Cantor style (ish)
 */
export function diagonal(n: number): [number, number] {
  let i = 0;
  let behind = 0;
  while (n > i + behind) {
    behind += ++i;
  }
  return [i + behind - n, n - behind];
}

export function multiDimensionDiagonal(
  numberOfDimensions: number
): (n: number) => number[] {
  return (n) => {
    let arr = diagonal(n);
    for (let i = 0; i < numberOfDimensions - 2; ++i)
      arr.push(...diagonal(arr.pop()));
    return arr;
  };
}

export function pairs<T, U>(a: Sequence<T>, b: Sequence<U>): Sequence<[T, U]> {
  return (n) => {
    let [i, j] = diagonal(n);
    return [a(i), b(j)];
  };
}
export function combinations<T>(sequence: Sequence<T>): Sequence<T[]> {
  return (n): T[] => {
    let bools = binaryCount(n);
    let result: T[] = [];
    for (let i = 0; i < bools.length; ++i)
      if (bools[i]) result.push(sequence(i));
    return result;
  };
}

export function filterSequence<T>(
  sequence: Sequence<T>,
  predicate: (item: T) => boolean,
  limitFactor = 10
): Sequence<T> {
  // TODO: log a warning about performance
  return (n) => {
    let limit = (n + 1) * limitFactor;
    for (let i = 0; i < limit; ++i) {
      let item = sequence(i);
      if (predicate(item)) if (n-- === 0) return item;
    }

    // otherwise
    throw new Error(
      `Stopped filtering sequence (n=${n}) because search exceeded ${limit} attempts`
    );
  };
}
