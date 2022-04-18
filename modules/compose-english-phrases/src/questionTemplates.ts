/**
 * @fileoverview
 *
 * This module contains two functions which were migrated from
 * `english-transformations`. This was to avoid a circular dependency between
 * `english-transformations` and the Template class. This may not be these
 * functions' final home.
 */

import Template from "english-template";
import {
  alternativeConjugation,
  getAuxiliaryVerb,
} from "english-transformations";

const { conjugate, PAST_TENSE } = alternativeConjugation;

export function questionTemplate(verb: string) {
  let { aux, remainder } = getAuxiliaryVerb(verb);
  if (remainder) return new Template(`>${aux} _ ${remainder}`);
  else return new Template(`>${aux} _`);
}

export function simplePastQuestionTemplate(
  verb: string,
  negative: "not" | false
) {
  let { aux, remainder } = getAuxiliaryVerb(verb);

  if (negative) remainder = remainder ? `not ${remainder}` : "not";

  if (aux == "be")
    return new Template(remainder ? `>were _ ${remainder}` : ">were _");
  else {
    // NOTE: The alternativeConjugation version
    let auxPast = conjugate(aux, PAST_TENSE);
    return new Template(remainder ? `${auxPast} _ ${remainder}` : auxPast);
  }
}

export function questionRegex(verb: string) {
  return questionTemplate(verb).regex();
}
