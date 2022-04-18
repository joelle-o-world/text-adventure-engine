import { regularVerbConjugation } from "./conjugateRegularVerb";
import { deconjugateIrregular } from "./irregularConjugations";
import { formNames, VerbForm } from "./verb-forms";

export function* deconjugate(word: string) {
  // Check for irregular conjugation
  let irreg = deconjugateIrregular(word);
  if (irreg) {
    for (let { infinitive, form } of irreg) {
      yield { form: formNames[form], infinitive };
    }

    // Don't continue regular deconjugation if irregular
    return;
  }

  // Do irregular de-conjugation
  for (let form in regularVerbConjugation)
    if (regularVerbConjugation[form].infinitive) {
      let infinitiveHypothesis = regularVerbConjugation[form].infinitive(word);
      if (infinitiveHypothesis != null) {
        if (typeof infinitiveHypothesis == "string")
          yield { form, infinitive: infinitiveHypothesis };
        else
          for (let inf of infinitiveHypothesis) yield { form, infinitive: inf };
      }
    }
}

export function deconjugateConcise(
  word: string
): { forms: VerbForm[]; infinitive: string }[] {
  const table: {
    [infinitive: string]: { forms: VerbForm[]; infinitive: string };
  } = {};
  for (let { form, infinitive } of deconjugate(word)) {
    if (table[infinitive]) table[infinitive].forms.push(form as VerbForm);
    else table[infinitive] = { forms: [form as VerbForm], infinitive };
  }
  return Object.values(table);
}
