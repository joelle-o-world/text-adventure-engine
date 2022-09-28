import PredicateSyntax from "./PredicateSyntax";

export function toAnnotationLogic(this: PredicateSyntax) {
  const args = this.params.map((param, i) => `[x${i}]`);
  return this.str(args);
}
