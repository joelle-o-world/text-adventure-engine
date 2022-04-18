import { shiftWord } from "string-utils";
import { alternativeConjugation } from "english-morphology";
const { conjugate, GERUND, PAST_PARTICIPLE, PAST_TENSE } =
  alternativeConjugation;

export function gerundify(verb: string) {
  let [first, rest] = shiftWord(verb);
  let gerund = conjugate(first, GERUND);

  return rest ? `${gerund} ${rest}` : gerund;
}

export function participly(verb: string) {
  let [first, rest] = shiftWord(verb);
  let participle = conjugate(first, PAST_PARTICIPLE);

  return rest ? `${participle} ${rest}` : participle;
}

export function pastify(verb: string) {
  let [first, rest] = shiftWord(verb);
  let past = conjugate(first, PAST_TENSE);

  return rest ? `${past} ${rest}` : past;
}
