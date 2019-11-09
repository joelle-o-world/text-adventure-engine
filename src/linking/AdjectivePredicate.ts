import { SyntacticPredicate } from "./SyntacticPredicate";
import { Adjective } from "../Adjective";
import { Template } from "../Template";
import { toCamelCase } from "../util/toCamelCase";

export class AdjectivePredicate extends SyntacticPredicate {
  adjective: Adjective;

  constructor(adj:Adjective) {
    super([
      new Template('_ <be '+adj.str),
    ], 'is'+toCamelCase(adj.str));

    this.adjective = adj;
  }
}