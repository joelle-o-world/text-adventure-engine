import { Adjective } from "../Adjective";

import { Noun } from "../Noun";

import { Predicate, createPredicate } from "../logic";
import { Dictionary } from "../Dictionary";
import PredicateSyntax from "predicate-syntax";
import { isTense, Tense } from "english-transformations";
import Template from "english-template";

/** There are 3 types of syntax (for now): Adjectives, nouns or sentences
 * MAY CHANGE IN FUTURE.
 */
declare type Syntax =
  | Adjective
  | Noun
  | { syntax: PredicateSyntax; tense: Tense };

export function isPredicateSyntaxWithTense(o: any): o is {
  syntax: PredicateSyntax;
  tense: Tense;
} {
  return (
    typeof o == "object" &&
    o.syntax instanceof PredicateSyntax &&
    isTense(o.tense)
  );
}

function syntaxObject(syntax: Syntax) {
  if (syntax instanceof Adjective || syntax instanceof Noun) return syntax;
  else return syntax.syntax;
}

/** A meaning is a predicate + a truth-value.
 * THIS TYPE MAY CHANGE IN THE FUTURE.
 */
export type Meaning<TruthValue extends string = "T" | "F" | "?"> = {
  predicate: Predicate;
  truth: TruthValue;
};

/**
 * A class for associating syntaxs (nouns, adjectives and sentences) with logical meanings (predicate + truth-value).
 */
export class SyntaxLogicLinkingMatrix<
  TruthValue extends string = "T" | "F" | "?"
> {
  /**
   * Index: syntaxs by meaning.
   */
  private m2sIndex: {
    [predicateSymbol: string]: {
      [truthValue: string]: Syntax[];
    };
  };

  /**
   * Index: meanings by syntax.
   */
  private s2mIndex: {
    adjectives: {
      [adjective: string]: Meaning<TruthValue>;
    };
    nouns: {
      [noun: string]: Meaning<TruthValue>;
    };
    statements: {
      [syntaxSymbol: string]: {
        [tense: string]: Meaning<TruthValue>;
      };
    };
  };

  /** A Dictionary object with all the syntaxs used in the matrix. */
  readonly dictionary?: Dictionary;

  constructor(options?: { dictionary?: Dictionary }) {
    // De-structure options.
    const { dictionary } = options || {};

    this.m2sIndex = {};
    this.s2mIndex = { nouns: {}, adjectives: {}, statements: {} };

    if (dictionary) {
      this.add(dictionary);
      this.dictionary = dictionary;
      // ! will there be duplicate entries in the dictionary?
    } else this.dictionary = new Dictionary();
  }

  /**
   * A flexible function for adding things to the matrix.
   */
  add(
    something:
      | Noun
      | Adjective
      | Template
      | PredicateSyntax
      | Dictionary
      | Syntax[]
  ): this {
    // Passed a noun,
    if (something instanceof Noun) {
      let noun: Noun = something;

      // Use the PredicateSyntax version to generate a meaning.
      let meaning = this.syntaxToMeaning({
        syntax: noun.predicateSyntax,
        tense: "simple_present",
      });

      // If that doesn't work
      //if(!meaning) {
      //// Add the PredicateSyntax and try again
      //this.add(noun.predicateSyntax)
      //meaning = this.syntaxToMeaning({
      //syntax: noun.predicateSyntax,
      //tense: 'simple_present'
      //})
      //}

      if (meaning) this.addLinkage(noun, meaning);
      else throw "Something is not working.";
    }

    // Passed an adjective,
    else if (something instanceof Adjective) {
      let adj = something;
      let meaning = this.syntaxToMeaning({
        syntax: adj.predicateSyntax,
        tense: "simple_present",
      });
      //if(!meaning) {
      //// Add it and try again.
      //this.add(adj.predicateSyntax);
      //meaning = this.syntaxToMeaning({
      //syntax: adj.predicateSyntax,
      //tense:'simple_present'
      //})
      //}

      if (meaning) this.addLinkage(adj, meaning);
      // Ok this is bad.
      else throw "Something is not working.";
    }

    // Passed an entire dictionary
    else if (something instanceof Dictionary) {
      let D = something;
      for (let syntax of D.statementSyntaxs) this.add(syntax);
      for (let noun of D.nouns) this.add(noun);
      for (let adj of D.adjectives) this.add(adj);
    }

    // Passed a PredicateSyntax object
    else if (something instanceof PredicateSyntax) {
      let syntax = something;
      this.addLinkage(
        { syntax, tense: "simple_present" },
        {
          predicate: createPredicate(
            syntax.numberOfArgs
            //`${Predicate.getNextSymbol()}_${syntax.name}`
          ),
          // @ts-ignore
          truth: "T",
        }
      );
    }

    // Passed a template
    else if (something instanceof Template)
      throw "SyntaxLogicLinkningMatrix doesn't yet support Templates.";
    // Passed a syntax array
    else if (something instanceof Array) {
      // Check they all take the same number of arguments.
      let syntaxs = something;
      let numberOfArgs = syntaxObject(syntaxs[0]).numberOfArgs;
      if (
        !syntaxs.every(
          (syntax) => syntaxObject(syntax).numberOfArgs == numberOfArgs
        )
      )
        throw "Syntaxs do not have matching numbers of arguments.";

      let predicate = createPredicate(
        numberOfArgs
        //syntaxObject(syntaxs[0]).symbol
      );
    }

    return this;
  }

  /** Associate a syntax with a meaning. */
  addLinkage(syntax: Syntax, meaning: Meaning<TruthValue>): void {
    // Update the syntax -> meaning index.
    if (syntax instanceof Adjective) {
      if (this.s2mIndex.adjectives[syntax.symbol])
        throw `Duplicate adjectives in linking matrix: '${syntax.symbol}'`;
      else this.s2mIndex.adjectives[syntax.symbol] = meaning;

      if (this.dictionary) this.dictionary.addAdjective(syntax);
    } else if (syntax instanceof Noun) {
      if (this.s2mIndex.nouns[syntax.symbol])
        throw `Duplicate nouns in linking matrix: '${syntax.symbol}'`;
      else this.s2mIndex.nouns[syntax.symbol] = meaning;

      if (this.dictionary) this.dictionary.addNoun(syntax);
    } else {
      // Syntax is predicate syntax.
      let subIndex = this.s2mIndex.statements[syntax.syntax.symbol];
      if (!subIndex)
        this.s2mIndex.statements[syntax.syntax.symbol] = subIndex = {};

      if (subIndex[syntax.tense])
        throw `Duplicate PredicateSyntax symbols in linking matrix: '${syntax.syntax.symbol};`;
      else subIndex[syntax.tense] = meaning;

      if (this.dictionary) this.dictionary.addStatementSyntax(syntax.syntax);
    }

    // Update the meaning -> syntax index.
    let predicateSymbol = meaning.predicate;
    if (this.m2sIndex[predicateSymbol]) {
      if (this.m2sIndex[predicateSymbol][meaning.truth])
        this.m2sIndex[predicateSymbol][meaning.truth].push(syntax);
      else this.m2sIndex[predicateSymbol][meaning.truth] = [syntax];
    } else this.m2sIndex[predicateSymbol] = { [meaning.truth]: [syntax] };
  }

  /** Given a meaning, get the corresponding syntaxs.
   * NOTE: meaning -> syntaxs is one to many.
   */
  meaningToSyntaxs(meaning: Meaning<TruthValue>): Syntax[] {
    let predicateSymbol = meaning.predicate;
    let subIndex = this.m2sIndex[predicateSymbol];
    if (subIndex) {
      let syntaxs = subIndex[meaning.truth];
      if (syntaxs) return syntaxs.slice();
      else return [];
    } else return [];
  }

  /** Given a syntax, get the corresponding meaining.
   * NOTE: syntax -> meaning is many to one.
   */
  syntaxToMeaning(syntax: Syntax): Meaning<TruthValue> | null {
    if (syntax instanceof Adjective) {
      return this.s2mIndex.adjectives[syntax.symbol] || null;
    } else if (syntax instanceof Noun) {
      return this.s2mIndex.nouns[syntax.symbol] || null;
    } else {
      // Syntax is PredicateSyntax.
      let subIndex = this.s2mIndex.statements[syntax.syntax.symbol];
      if (subIndex) return subIndex[syntax.tense] || null;
      else return null;
    }
  }

  /** To make testing more concise. Finds a meaning for a syntax or throws an exception. Only use if you are sure a meaning should exist for the syntax. */
  syntaxToMeaningOrCrash(syntax: Syntax): Meaning<TruthValue> {
    let meaning = this.syntaxToMeaning(syntax);
    if (meaning) return meaning;
    else throw `No logical meaning for syntax: ${syntax}`;
  }
}
