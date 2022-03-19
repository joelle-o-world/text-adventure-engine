export type Morphology<Form extends string = string> = {
  [fromPos in Form]: {
    [toPos in Form]: (before: string) => string | string[] | null;
  };
};

export type MorphologyRelation = {
  form: string;
  base: string;
  baseForm: string;
};

export function isMorphologyRelation(x: any): x is MorphologyRelation {
  return (
    typeof x === "object" &&
    typeof x.form === "string" &&
    typeof x.base === "string" &&
    typeof x.baseForm === "string"
  );
}
