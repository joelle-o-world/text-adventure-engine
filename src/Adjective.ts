import { toSnakeCase } from "string-utils";
import PredicateSyntax from "predicate-syntax";

/** Class for storing an adjecitve inside a `Dictionary` object. */
export class Adjective {
  str: string;
  phrasal: boolean;
  readonly symbol: string;
  predicateSyntax: PredicateSyntax;
  numberOfArgs = 1;

  constructor(str: string) {
    this.str = str;
    this.phrasal = /\s/.test(str);

    this.predicateSyntax = new PredicateSyntax(`be ${str}`, ["subject"]);

    this.symbol = toSnakeCase(this.str);
    this.numberOfArgs = 1;
  }

  get lastWord() {
    return this.str.slice(this.str.lastIndexOf(" ") + 1);
  }
}
