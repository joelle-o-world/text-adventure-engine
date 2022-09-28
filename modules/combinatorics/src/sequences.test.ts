import {
  binaryCount,
  counter,
  diagonal,
  Sequence,
  triangleCount,
} from "./sequences";
import { bulletPoints } from "formatting";

declare global {
  namespace jest {
    interface Matchers<R extends Sequence<unknown>> {
      toBeSequence(expectedPositionValues: {
        [position: number]: ReturnType<R>;
      }): CustomMatcherResult;
    }
  }
}

expect.extend({
  toBeSequence<T>(
    sequence: Sequence<T>,
    sequencePositionChecks: { [position: number]: T }
  ) {
    const failures: string[] = [];
    for (let position in sequencePositionChecks) {
      const actualValue = sequence(Number(position));
      if (this.equals(actualValue, sequencePositionChecks[position])) continue;
      else
        failures.push(
          `Expected sequence(${position}) to be ${JSON.stringify(
            sequencePositionChecks[position]
          )}, got ${JSON.stringify(actualValue)}`
        );
    }

    if (failures.length)
      return { pass: false, message: () => bulletPoints(failures) };
    else return { pass: true, message: () => "" };
  },
});

describe("combinatorics", () => {
  test("diagonal(n)", () => {
    expect(diagonal).toBeSequence([
      [0, 0],
      [1, 0],
      [0, 1],
      [2, 0],
      [1, 1],
      [0, 2],
      [3, 0],
      [2, 1],
      [1, 2],
      [0, 3],
    ]);
  });

  test("binaryCount", () => {
    expect(binaryCount).toBeSequence([
      [],
      [1],
      [0, 1],
      [1, 1],
      [0, 0, 1],
      [1, 0, 1],
    ]);
  });

  test("decimal count", () => {
    expect(counter(10)).toBeSequence({
      0: [],
      1: [1],
      42: [2, 4],
    });
  });

  test("triangleCount", () => {
    expect(triangleCount).toBeSequence([
      [],
      [1],
      [0, 1],
      [1, 1],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
      [0, 0, 1],
      [1, 0, 1],
      [2, 0, 1],
      [3, 0, 1],
      [0, 1, 1],
    ]);
  });
});
