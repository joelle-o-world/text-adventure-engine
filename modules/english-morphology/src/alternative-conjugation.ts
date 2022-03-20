/*
  Given the infinitive form of a verb and a person/verbform number (0-8) return
  the conjugated verb form.
*/

/*
VERB FORMS DENOTED AS NUMBERS:
  0.  infinitive
  1.  first person singular
  2.  second person singular
  3.  third person singular
  4.  first person plural
  5.  second person plural
  6.  third person plural
  (7.  gerund/present-participle)
  (8.  past-participle)
  (9. past tense form)
*/

import * as regOp from "regops";
import { getIrregularConjugation } from "./irregularConjugations";
import { shiftWord } from "string-utils";

const endsWithShortConsonant = /[aeiou][tpdnl]$/;
const endsWithE = /e$/;
const endsWithOOrX = /[oxzs]$/;

// TODO: Use an enum
export const FIRST_PERSON_SINGULAR = 1; // I
export const SECOND_PERSON_SINGULAR = 2; // you
export const THIRD_PERSON_SINGULAR = 3; // he/she/it
export const FIRST_PERSON_PLURAL = 4; // we
export const SECOND_PERSON_PLURAL = 5; // you
export const THIRD_PERSON_PLURAL = 6; // they
export const GERUND = 7;
export const PAST_PARTICIPLE = 8;
export const PAST_TENSE = 9;
export const ALL_PERSON_REGEX = 10;
declare type VerbForm = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/** Conjugate a verb (by itself) */
export function conjugate(verb: string, form: number): string {
  let i1 = verb.search(/[ .,!?]/);

  let infinitive: string, extra: string;
  if (i1 == -1) {
    infinitive = verb;
    extra = "";
  } else {
    infinitive = verb.slice(0, i1);
    extra = verb.slice(i1);
  }

  let conjugated,
    irregular = getIrregularConjugation(infinitive, form);
  if (form == ALL_PERSON_REGEX) conjugated = anyPersonRegex(infinitive);
  else if (irregular) conjugated = irregular;
  else conjugated = conjugateRegular(infinitive, form);

  return conjugated + extra;
}

/** Conjugate a regular verb. */
function conjugateRegular(infinitive: string, form: number) {
  switch (form) {
    // third person singular
    case THIRD_PERSON_SINGULAR:
      if (endsWithOOrX.test(infinitive)) return infinitive + "es";
      else return infinitive + "s";

    // gerund
    case GERUND:
      if (endsWithE.test(infinitive))
        return infinitive.slice(0, infinitive.length - 1) + "ing";
      if (endsWithShortConsonant.test(infinitive))
        return infinitive + infinitive[infinitive.length - 1] + "ing";
      return infinitive + "ing";

    // past participle
    case PAST_TENSE:
    case PAST_PARTICIPLE:
      if (endsWithShortConsonant.test(infinitive))
        return infinitive + infinitive[infinitive.length - 1] + "ed";
      if (endsWithE.test(infinitive)) return infinitive + "d";
      else return infinitive + "ed";

    case ALL_PERSON_REGEX:
      return anyPersonRegex(infinitive);

    default:
      return infinitive;
  }
}

/** Get a regular expression matching any conjugation of the verb (Except infinitive, past participle or gerund). */
export function anyPersonRegex(infinitive: string) {
  const [firstWord, remainder] = shiftWord(infinitive);

  let forms: string[] = [];
  for (let person = 1; person <= 6; ++person) {
    let form = conjugate(firstWord, person);
    if (!forms.includes(form)) forms.push(form);
  }
  let result = regOp.or(...forms.sort((a, b) => b.length - a.length));
  if (remainder) result = regOp.concatSpaced(remainder);
  return result;
}

export function anyConjugationRegex(infinitive: string) {
  const [firstWord, remainder] = shiftWord(infinitive);

  let forms: string[] = [];
  for (let person = 0; person <= 9; ++person) {
    let form = conjugate(firstWord, person);
    if (!forms.includes(form)) forms.push(form);
  }

  if (firstWord == "be") forms.push("was");

  let result = regOp.or(...forms.sort((a, b) => b.length - a.length));
  if (remainder) result = regOp.concatSpaced(result, remainder);

  return result;
}

// Determine the numeric person of a given noun phrase

/*
VERB FORMS DENOTED AS NUMBERS:
  0.  infinitive
  1.  first person singular
  2.  second person singular
  3.  third person singular
  4.  first person plural
  5.  second person plural
  6.  third person plural
  (7. gerund/present-participle)
  (8. past-participle)
  (9. past tense form)
*/

const placeholderRegex = /(?:S|O|#|@|L)?_(?:'s)?/g;
const placeholderTest = new RegExp("^" + placeholderRegex.source + "$", "");

/** Given a string or some other object, determine the person (aka verb form) for conjugation. */
export function getPerson(subject: string | RegExp) {
  // if subject is not a string, assume third person for now
  if (subject instanceof RegExp) return 10;

  if (typeof subject != "string") return 3;

  const lowerCaseSubject = subject.toLowerCase();

  if (lowerCaseSubject == "i") return 1;
  // first person singular
  else if (lowerCaseSubject == "you") return 2;
  // or 5 but never mind
  else if (/^(he|she|it)$/i.test(subject)) return 3;
  // third person singular
  else if (lowerCaseSubject == "we") return 4;
  // first person plural
  else if (lowerCaseSubject == "they") return 6;
  // third person plural
  else if (subject.constructor == RegExp || placeholderTest.test(subject))
    return 10;
  // placeholder, get regex
  // otherwise assume third person
  else return 3;

  // TODO, what about third person plural non pronouns!
}
