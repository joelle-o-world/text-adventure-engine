import {
  endsWithDoubleShortConsonant,
  endsWithE,
  endsWithEd,
  endsWithIng,
  endsWithOesOrXes,
  endsWithOOrX,
  endsWithS,
  endsWithShortConsonant,
} from "useful-regular-expressions";
import { Morphology } from "./Morphology";
import { VerbForm } from "./verb-forms";

export const regularVerbConjugation: Morphology<string> = {
  // Conjugate the infinitive
  infinitive: {
    infinitive: (x) => x,
    firstPersonSingular: (infinitive) => infinitive,

    secondPersonSingular: (infinitive) => infinitive,

    thirdPersonSingular(infinitive) {
      if (endsWithOOrX.test(infinitive)) return infinitive + "es";
      else return infinitive + "s";
    },

    firstPersonPlural(infinitive) {
      return infinitive;
    },

    secondPersonPlural(infinitive) {
      return infinitive;
    },

    thirdPersonPlural(infinitive) {
      return infinitive;
    },

    gerund(infinitive) {
      if (endsWithE.test(infinitive))
        return `${infinitive.slice(0, infinitive.length - 1)}ing`;
      else if (endsWithShortConsonant.test(infinitive))
        return `${infinitive}${infinitive[infinitive.length - 1]}ing`;
      else return `${infinitive}ing`;
    },

    pastTense(infinitive) {
      if (endsWithShortConsonant.test(infinitive))
        return `${infinitive}${infinitive[infinitive.length - 1]}ed`;
      else if (endsWithE.test(infinitive)) return `${infinitive}d`;
      else return `${infinitive}ed`;
    },

    pastParticiple(infinitive) {
      if (endsWithShortConsonant.test(infinitive))
        return `${infinitive}${infinitive[infinitive.length - 1]}ed`;
      else if (endsWithE.test(infinitive)) return `${infinitive}d`;
      else return `${infinitive}ed`;
    },
  },

  // De-conjugations
  firstPersonSingular: {
    infinitive(firstPersonSingular) {
      return firstPersonSingular;
    },
  },

  secondPersonSingular: {
    infinitive(secondPersonPlural) {
      return secondPersonPlural;
    },
  },

  thirdPersonSingular: {
    infinitive(thirdPersonSingular) {
      if (endsWithS.test(thirdPersonSingular)) {
        if (endsWithOesOrXes.test(thirdPersonSingular))
          return [
            thirdPersonSingular.slice(0, -1),
            thirdPersonSingular.slice(0, -2),
          ];
        else return thirdPersonSingular.slice(0, -1);
      }
      // Either not a match or its irregular
      else return null;
    },
  },

  firstPersonPlural: {
    infinitive(firstPersonPlural) {
      return firstPersonPlural;
    },
  },

  secondPersonPlural: {
    infinitive(secondPersonPlural) {
      return secondPersonPlural;
    },
  },

  thirdPersonPlural: {
    infinitive(thirdPersonPlural) {
      return thirdPersonPlural;
    },
  },

  gerund: {
    infinitive(gerund) {
      if (endsWithIng.test(gerund)) {
        let minusIng = gerund.slice(0, -3);
        let plusE = minusIng + "e";
        if (endsWithDoubleShortConsonant.test(minusIng)) {
          let minusDouble = minusIng.slice(0, -1);
          return [minusDouble, minusIng, plusE];
        } else return [minusIng, plusE];
      }
      // Must be irregular or non-match for gerund form
      else return null;
    },
  },

  pastTense: {
    infinitive(pastTense) {
      if (endsWithEd.test(pastTense)) {
        let minusD = pastTense.slice(0, -1);
        let minusEd = pastTense.slice(0, -2);
        if (endsWithDoubleShortConsonant.test(minusEd)) {
          let minusDouble = minusEd.slice(0, -1);
          return [minusDouble, minusD, minusEd];
        } else return [minusD, minusEd];
      }
      // Not recognised as past tense form of regular verb
      else return null;
    },
  },

  pastParticiple: {
    infinitive(pastParticiple) {
      if (endsWithEd.test(pastParticiple)) {
        let minusD = pastParticiple.slice(0, -1);
        let minusEd = pastParticiple.slice(0, -2);
        if (endsWithDoubleShortConsonant.test(minusEd)) {
          let minusDouble = minusEd.slice(0, -1);
          return [minusDouble, minusD, minusEd];
        } else return [minusD, minusEd];
      } else return null;
    },
  },
};

export function conjugateRegularVerb(
  infinitive: string,
  person: VerbForm
): string {
  const transformFunction = regularVerbConjugation.infinitive[person];
  if (!transformFunction)
    throw new Error(
      `Couldn't find transformation function for conjugating infinitive -> ${person}`
    );
  const conjugated = transformFunction(infinitive);
  if (typeof conjugated !== "string")
    throw new Error("Conjugations must return a string");
  else return conjugated;
}
