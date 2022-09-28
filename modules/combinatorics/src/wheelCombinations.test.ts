import { wheelCombinations } from "./wheelCombinations";
import all from "it-all";

describe("Wheel combinations", () => {
  test("Simple binary counting", async () => {
    const combinations = await all(wheelCombinations([0, 1], [0, 1], [0, 1]));

    expect(combinations).toStrictEqual([
      [0, 0, 0],
      [0, 0, 1],
      [0, 1, 0],
      [0, 1, 1],
      [1, 0, 0],
      [1, 0, 1],
      [1, 1, 0],
      [1, 1, 1],
    ]);
  });
});
