import { conjugate } from ".";
import { VerbForm } from "./conjugate";

describe("Conjugating verbs", () => {
  test.each([
    ["eat", "firstPersonSingular", "eat"],
    ["eat", "secondPersonSingular", "eat"],
    ["eat", "thirdPersonSingular", "eats"],
    ["eat", "thirdPersonPlural", "eat"],
    ["eat", "pastTense", "ate"],
    ["eat", "pastParticiple", "eaten"],
    ["go", "thirdPersonSingular", "goes"],
    ["go", "pastTense", "went"],
  ])(
    "conjugate(%o, %o) = %o",
    (infinitive: string, verbForm: VerbForm, expectedConjugation: string) =>
      expect(conjugate(infinitive, verbForm)).toBe(expectedConjugation)
  );
});
