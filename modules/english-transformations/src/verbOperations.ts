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

export function questionTemplate(verb: string) {
  throw "TODO: Rewrite without dependency on Template module";
  //let { aux, remainder } = getAuxiliaryVerb(verb);
  //if (remainder) return new Template(`>${aux} _ ${remainder}`);
  //else return new Template(`>${aux} _`);
}

export function simplePastQuestionTemplate(
  verb: string,
  negative: "not" | false
) {
  throw "TODO: Rewrite without dependency on Template module";
  //let { aux, remainder } = getAuxiliaryVerb(verb);

  //if (negative) remainder = remainder ? `not ${remainder}` : "not";

  //if (aux == "be")
  //return new Template(remainder ? `>were _ ${remainder}` : ">were _");
  //else {
  //let auxPast = conjugate(aux, PAST_TENSE);
  //return new Template(remainder ? `${auxPast} _ ${remainder}` : auxPast);
  //}
}

export function questionRegex(verb: string) {
  throw "TODO: Rewrite without dependency on Template module";
  //return questionTemplate(verb).regex();
}
