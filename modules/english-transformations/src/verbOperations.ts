import { shiftWord } from "string-utils";
import { alternativeConjugation } from "english-morphology";
import { VerbFormNumber } from "english-morphology/src/verb-forms";
const { conjugate } = alternativeConjugation;

export function gerundify(verb: string) {
  let [first, rest] = shiftWord(verb);
  let gerund = conjugate(first, VerbFormNumber.GERUND);

  return rest ? `${gerund} ${rest}` : gerund;
}

export function participly(verb: string) {
  let [first, rest] = shiftWord(verb);
  let participle = conjugate(first, VerbFormNumber.PAST_PARTICIPLE);

  return rest ? `${participle} ${rest}` : participle;
}

export function pastify(verb: string) {
  let [first, rest] = shiftWord(verb);
  let past = conjugate(first, VerbFormNumber.PAST_TENSE);

  return rest ? `${past} ${rest}` : past;
}
