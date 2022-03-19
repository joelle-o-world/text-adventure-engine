import { plural, singular } from "./plural";

describe("Plural & Singular nouns", () => {
  for (let [sing, plur] of Object.entries({
    cat: "cats",
    sheep: "sheep",
    fish: "fishes",
    woman: "women",
    man: "men",
  })) {
    test(`The plural of '${sing}' is '${plur}'`, () => {
      expect(plural(sing)).toContain(plur);
    });
    test(`the singular of '${plur}' is '${sing}'`, () => {
      expect(singular(plur)).toContain(sing);
    });
  }
});
