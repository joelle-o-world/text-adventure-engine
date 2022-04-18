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
import { shiftWord } from "string-utils";
import { conjugateRegularVerb } from "./conjugateRegularVerb";
import { conjugateIrregularVerb } from "./irregularConjugations";
import { VerbFormNumber, numberToVerbForm } from "./verb-forms";

/**
 * Conjugate a verb (by itself)
 *
 * ## Differences between this and the main `conjugate` function
 *
 *  - Accepts a number for `form` instead of a string
 *  - Returns a single string, never an array or null
 *  - Can handle phrasal verbs
 *  - Attempts to return RegExp (but buggy)
 */
export function conjugate(verb: string, form: VerbFormNumber): string {
  const [infinitive, extra] = splitPhrasalVerb(verb);

  if (form === VerbFormNumber.ALL_PERSON_REGEX) {
    // BUG: probably need to escape extra and make sure what is returned is a regexp?
    return anyPersonRegex(infinitive) + extra;
  }

  let conjugated =
    conjugateIrregularVerb(infinitive, numberToVerbForm(form)) ||
    conjugateRegularVerb(infinitive, numberToVerbForm(form));

  return conjugated + extra;
}

/**
 * Sometimes verbs have more than one word, in these cases we often want to
 * treat the first word as the infinitive. This function fetches the first
 * word from the phrasal verb
 */
export function splitPhrasalVerb(verb: string): [string, string] {
  let i1 = verb.search(/[ .,!?]/);
  if (i1 == -1) return [verb, ""];
  else return [verb.slice(0, i1), verb.slice(i1)];
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
