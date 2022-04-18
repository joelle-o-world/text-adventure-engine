// list of irregular verbs with their conjugations.
// (indexed by infinitive)

import { VerbForm, VerbFormNumber, verbFormToNumber } from "./verb-forms";

const irregularConjugations: {
  [key: string]: {
    [key in VerbFormNumber]?: string;
  };
} = {
  be: {
    1: "am",
    2: "are",
    3: "is",
    4: "are",
    5: "are",
    6: "are",
    7: "being",
    8: "been",
    9: "were",
  },

  can: { 9: "could" },
  could: { 9: "could" },
  do: { 9: "did" },
  may: { 9: "may" },
  might: { 9: "might" },
  must: { 9: "must" },
  need: { 9: "needed" },
  ought: { 9: "ought" },
  shall: { 9: "shall" },
  should: { 9: "should" },
  will: { 3: "will", 9: "will" },
  would: { 9: "would" },

  say: { 8: "said", 9: "said" },

  make: { 8: "made", 9: "made" },
  go: { 8: "gone", 9: "went" },
  take: { 8: "taken", 9: "took" },
  come: { 8: "come", 9: "came" },
  see: { 7: "seeing", 8: "seen", 9: "saw" },
  know: { 8: "known", 9: "knew" },
  get: { 8: "got", 9: "got" },
  run: { 8: "run", 9: "ran" },
  were: { 1: "was", 3: "was" },

  have: { 3: "has", 8: "had", 9: "had" },
  had: { 3: "had" },
  eat: { 7: "eating", 8: "eaten", 9: "ate" },
  contain: { 7: "containing", 8: "contained", 9: "contained" },
  hold: { 8: "held", 9: "held" },
  put: { 8: "put", 9: "put" },
  poop: { 7: "pooping", 8: "pooped", 9: "pooped" },
  steal: { 7: "stealing", 8: "stolen", 9: "stole" },
  lead: { 7: "leading", 8: "lead", 9: "lead" },
  lie: { 7: "lying", 8: "lay", 9: "lay" },
  sleep: { 7: "sleeping", 8: "slept", 9: "slept" },
  // TODO: give,
  // TODO: find,
  // TODO: think,
  // TODO: tell,
  become: { 8: "become", 9: "became" },
  // TODO: show
  // TODO: leave
  // TODO: feel
  // TODO: bring
  // TODO: begin
  // TODO: keep
  // TODO: write
  // TODO: stand
  // TODO: hear
  // TODO: let
  // TODO: mean
  // TODO: set
  // TODO: meet
  // TODO: pay
  // TODO: sit
  // TODO: speak
  // TODO: lie
  // TODO: lead
  read: { 7: "reading", 8: "read", 9: "read" },
  // TODO: grow
  // TODO: lose
  // TODO: fall
  // TODO: send
  // TODO: build
  // TODO: understood
  // TODO: draw
  // TODO: break
  // TODO: spend
  // TODO: cut
  // TODO: rise
  // TODO: drive
  // TODO: buy
  // TODO: wear
  // TODO: choose

  // TODO: to shit
};

// Construct a reverse index
const reverseIndex: {
  [key: string]: { infinitive: string; form: VerbFormNumber }[];
} = {};
for (let infinitive in irregularConjugations) {
  for (let form in irregularConjugations[infinitive]) {
    // @ts-ignore
    let verb = irregularConjugations[infinitive][form];
    if (!reverseIndex[verb]) reverseIndex[verb] = [];

    reverseIndex[verb].push({ infinitive, form: parseInt(form) });
  }
}

export function conjugateIrregularVerb(verb: string, form: VerbForm) {
  const verbFormNumber = verbFormToNumber(form);
  if (
    irregularConjugations[verb] &&
    irregularConjugations[verb][verbFormNumber]
  )
    return irregularConjugations[verb][verbFormNumber];
  else return null;
}

/**
 * @deprecated - alias for conjugateIrregularVerb
 */
export const getIrregularConjugation = conjugateIrregularVerb;

export function deconjugateIrregular(verb: string) {
  if (reverseIndex[verb]) return reverseIndex[verb];
  else return null;
}
