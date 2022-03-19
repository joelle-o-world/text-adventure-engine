export {
  conjugate,
  conjugationTable,
  deconjugate,
  deconjugateConcise,
} from "./conjugate";
export { plural, singular } from "./plural";

/** @deprecated */
export type MorphologyRelation = {
  form: string;
  base: string;
  baseForm: string;
};

/** @deprecated */
export function isMorphologyRelation(x: any): x is MorphologyRelation {
  return (
    typeof x === "object" &&
    typeof x.form === "string" &&
    typeof x.base === "string" &&
    typeof x.baseForm === "string"
  );
}

export * as alternativeConjugation from "./alternative-conjugation";

export { isPastParticiple } from "./isPastParticiple";

export { toPossessiveAdjective as possessiveAdjective } from "./toPossessiveAdjective";

/**
 * @deprecated - use `possessiveAdjetive()` instead
 */
export { toPossessiveAdjective } from "./toPossessiveAdjective";
