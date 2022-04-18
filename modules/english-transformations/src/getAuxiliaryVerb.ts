import { alternativeConjugation } from "english-morphology";
import { VerbFormNumber } from "english-morphology/src/verb-forms";
import { getFirstWord } from "string-utils";
const { conjugate } = alternativeConjugation;

const auxiliaryInfitinitives = [
  "be",
  "can",
  "could",
  "dare",
  "do",
  "have",
  "may",
  "might",
  "must",
  "need",
  "ought",
  "shall",
  "should",
  "will",
  "would",
];

export const auxilliaryPasts = auxiliaryInfitinitives.map((ing) =>
  conjugate(ing, VerbFormNumber.PAST_TENSE)
);

const auxiliaryVerbs: string[] = [];
for (let infinitive of auxiliaryInfitinitives) {
  if (!auxiliaryVerbs.includes(infinitive)) auxiliaryVerbs.push(infinitive);

  for (let form of [1, 2, 3, 4, 5, 6, 9]) {
    let verb = conjugate(infinitive, form);
    if (!auxiliaryVerbs.includes(verb)) auxiliaryVerbs.push(verb);
  }
}

/**  */
export default function getAuxiliaryVerb(infinitive: string): {
  aux: string;
  remainder: string | null;
} {
  let firstWord = getFirstWord(infinitive);
  if (auxiliaryVerbs.includes(firstWord)) {
    let aux = firstWord;
    let remainder: string | null = infinitive.slice(firstWord.length).trim();
    if (remainder.length == 0) remainder = null;

    return { aux, remainder };
  } else {
    return {
      aux: "do",
      remainder: infinitive,
    };
  }
}
