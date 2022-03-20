import { toCamelCase, splitCamelCase } from "string-utils";

export function createAdjectivePredicate(adj: string): string {
  return `${toCamelCase(`is ${adj}`)}/1`;
}

export function parseAdjectivePredicate(P: string): string {
  return splitCamelCase(P.slice(0, P.indexOf("<")))
    .slice(1)
    .join(" ");
}

export function createNounPredicate(noun: string): string {
  return `${toCamelCase(`is a ${noun}`)}/1`;
}

export function createPredicateSyntaxPredicate({
  verb,
  params,
}: {
  verb: string;
  params: string[];
}): string {
  return `${toCamelCase(verb)}_${params.map((p) => toCamelCase(p)).join("_")}/${
    params.length
  }`;
}
