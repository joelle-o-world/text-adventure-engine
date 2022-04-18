import { conjugateIrregularVerb } from "./irregularConjugations";
import { VerbForm } from "./verb-forms";
import {
  conjugateRegularVerb,
  regularVerbConjugation,
} from "./conjugateRegularVerb";

/**
 * Conjugate an english verb
 *
 * Will return an array of strings if ... ?
 */
export function conjugate(
  /**
   * The verb in infinitive form
   */
  infinitive: string,
  /**
   * The form into which to conjugate the verb.
   */
  person: VerbForm
): string | string[] | null {
  return (
    conjugateIrregularVerb(infinitive, person) ||
    conjugateRegularVerb(infinitive, person)
  );
}

export function conjugationTable(infinitive: string) {
  const table: { [form: string]: string } = {};
  console.log(regularVerbConjugation.infinitive);
  for (let form in regularVerbConjugation.infinitive)
    table[form] = regularVerbConjugation.infinitive[form](infinitive) as string;
  return table;
}
