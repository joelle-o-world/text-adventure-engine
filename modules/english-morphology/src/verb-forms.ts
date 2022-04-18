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

export const enum VerbForm {
  INFINITIVE = "infinitive",
  FIRST_PERSON_SINGULAR = "firstPersonSingular",
  SECOND_PERSON_SINGULAR = "secondPersonSingular",
  THIRD_PERSON_SINGULAR = "thirdPersonSingular",
  FIRST_PERSON_PLURAL = "firstPersonPlural",
  SECOND_PERSON_PLURAL = "secondPersonPlural",
  THIRD_PERSON_PLURAL = "thirdPersonPlural",
  GERUND = "gerund",
  PAST_PARTICIPLE = "pastParticiple",
  PAST_TENSE = "pastTense",
  ALL_PERSON_REGEX = "allPersonRegex",
}

export enum VerbFormNumber {
  INFINITIVE = 0,
  FIRST_PERSON_SINGULAR = 1, // I
  SECOND_PERSON_SINGULAR = 2, // you
  THIRD_PERSON_SINGULAR = 3, // he/she/it
  FIRST_PERSON_PLURAL = 4, // we
  SECOND_PERSON_PLURAL = 5, // you
  THIRD_PERSON_PLURAL = 6, // they
  GERUND = 7, // -ing
  PAST_PARTICIPLE = 8,
  PAST_TENSE = 9,
  ALL_PERSON_REGEX = 10,
}

export function verbFormToNumber(person: VerbForm): VerbFormNumber {
  return formNames.indexOf(person);
}

/**
 * Inverse operation to `verbFormToNumber`.
 */
export function numberToVerbForm(form: VerbFormNumber): VerbForm {
  return formNames[form];
}

/** Used for compatibility with older code that used numbers instead of
 * strings to represent verb forms */
export const formNames: VerbForm[] = [
  VerbForm.INFINITIVE,
  VerbForm.FIRST_PERSON_SINGULAR,
  VerbForm.SECOND_PERSON_SINGULAR,
  VerbForm.THIRD_PERSON_SINGULAR,
  VerbForm.FIRST_PERSON_PLURAL,
  VerbForm.SECOND_PERSON_PLURAL,
  VerbForm.THIRD_PERSON_PLURAL,
  VerbForm.GERUND,
  VerbForm.PAST_PARTICIPLE,
  VerbForm.PAST_TENSE,
  VerbForm.ALL_PERSON_REGEX,
];

export const conjugationForms = formNames.slice(1, 7);
