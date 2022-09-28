/**
 * You know, like when there are wheels?
 */
export function* wheelCombinations<T = string>(
  ...wheels: T[][]
): Generator<T[]> {
  const numberOfCombinations = wheels.reduce(
    (previous, current) => previous * current.length,
    1
  );
  for (let i = 0; i < numberOfCombinations; ++i) {
    let j = i;
    let combination: T[] = [];
    for (let d = wheels.length - 1; d >= 0; --d) {
      const wheel: T[] = wheels[d];
      combination[d] = wheel[j % wheel.length];
      j = Math.floor(j / wheel.length);
    }
    yield combination;
  }
}
