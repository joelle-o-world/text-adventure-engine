import {
  or,
  g,
  wholeWord,
  initial,
  initialAndWholeWord,
  concat,
} from "regular-expression-operations";
import {
  composeSentence,
  questionRegex,
  simplePastQuestionTemplate,
} from "compose-english-phrases";
import Template from "english-template";
import {
  Tense,
  allTenses,
  verbToTense,
  getAuxiliaryVerb,
  alternativeConjugation,
  makeNegative,
} from "english-transformations";
import { toCamelCase, toSnakeCase } from "string-utils";
import { sentenceFormSymbol } from "english-transformations";
import { shiftWord } from "string-utils";
import { createPredicateSyntaxPredicate } from "./linking";
import { VerbFormNumber } from "english-morphology/src/verb-forms";
const { anyPersonRegex, anyConjugationRegex, conjugate } =
  alternativeConjugation;

type Param = { name: string; index: number; entity: true };

export interface PredicateSyntaxParse<ARGTYPE = string> {
  /** The arguments of the parsed string */
  syntaxKind: "predicate_syntax";
  args: [...ARGTYPE[]];
  tense: Tense;
  negative: "not" | false;
  question: boolean;
  nounPhraseFor: number | null;
  syntax: PredicateSyntax;
  /** The original string. */
  str: string;
  from: number;
  to: number;
  /** Part of speech. */
  pos: "NP" | "S";
}

export default class PredicateSyntax {
  /** The infinitive form of the verb. */
  readonly infinitive: string;

  /** A regex used for parsing the verb. */
  readonly verbRegex: RegExp;

  readonly quickCheckRegex: RegExp;

  /** A regex which matches the subject and conjugated verb (with auxiliary before the known). E.g./ "do you see" */
  readonly questionRegex: RegExp;

  /** An index of regular expressions for each form. */
  private regexIndex: { [key: string]: RegExp };

  /** A regex that matches any of the prepositions in this syntax. */
  readonly prepositionRegex: RegExp | null;

  /** A list of prepositions in this regex */
  readonly prepositions: string[];

  /** Does the regex have an object parameter? */
  readonly includesObject: boolean;

  /** Does the syntax have subject parameter? */
  readonly includesSubject: boolean;

  /** Ordered list of syntax parameters. */
  readonly params: Param[];

  /** Used for making ordered lists from associative arguments. */
  readonly paramIndex: { [key: string]: Param };

  /** How many arguments does the syntax take? */
  readonly numberOfArgs: number;

  readonly name: string;
  readonly symbol: string;

  constructor(infinitive: string, params: string[]) {
    this.infinitive = infinitive;

    this.regexIndex = {};

    // Create a regex for parsing verbs
    this.verbRegex = wholeWord(anyPersonRegex(infinitive));
    this.quickCheckRegex = composeQuickCheckRegex(infinitive);

    // Create a question regex
    let { aux, remainder } = getAuxiliaryVerb(this.infinitive);
    this.questionRegex = initial(
      new Template(
        ">" + aux + " _" + (remainder ? " " + remainder : "")
      ).regex()
    );

    // Make a list of preopositional arguments
    this.prepositions = params.filter((param) => !/subject|object/.test(param));

    // Create a regex for parsing prepositional arguments
    this.prepositionRegex = this.prepositions.length
      ? g(wholeWord(or(...this.prepositions).source))
      : null;

    this.includesSubject = params.includes("subject");
    this.includesObject = params.includes("object");

    this.params = params.map((name, index) => ({ name, index, entity: true }));

    this.paramIndex = {};
    for (let i = 0; i < params.length; ++i)
      this.paramIndex[params[i]] = this.params[i];

    this.numberOfArgs = this.params.length;

    // Choose a (non-unique) name
    this.name = toCamelCase(
      conjugate(this.infinitive, VerbFormNumber.THIRD_PERSON_SINGULAR),
      ...this.prepositions
    );

    // Choose a unique symbol
    this.symbol = `${toSnakeCase(infinitive)}(${params
      .map((str) => toSnakeCase(str))
      .join(",")})`;
  }

  *parse(
    str: string,
    options: {
      tenses?: Tense[];
      asStatement?: boolean;
      asNegative?: boolean;
      asQuestion?: boolean;
      asNounPhrase?: boolean;
    } = {}
  ): Generator<PredicateSyntaxParse> {
    // Dismiss immediately if it doesn't pass the quick check.
    if (!this.quickCheck(str)) return null;

    // De-structure options
    const {
      tenses = allTenses,
      asStatement = true,
      asNegative = true,
      asQuestion = true,
      asNounPhrase = true,
    } = options;

    let nounPhraseFors = [];
    if (asStatement) nounPhraseFors.push(null);
    if (asNounPhrase) nounPhraseFors.push(...this.params.map((p) => p.name));

    for (let tense of tenses) {
      for (let nounPhraseFor of nounPhraseFors) {
        let parse = this.parseSpecific(str, { tense, nounPhraseFor });
        if (parse) yield parse;

        if (asNegative) {
          let parse = this.parseSpecific(str, {
            tense,
            negative: "not",
            nounPhraseFor,
          });
          if (parse) yield parse;
        }
      }

      if (asQuestion) {
        let parse = this.parseSpecific(str, { tense, question: true });
        if (parse) yield parse;

        if (asNegative) {
          let parse = this.parseSpecific(str, {
            tense,
            question: true,
            negative: "not",
          });
          if (parse) yield parse;
        }
      }
    }
  }

  /**
   * Attempt to parse a string using a pre-defined tense, question form, negation and/or noun-phrase form.
   */
  parseSpecific(
    str: string,
    options:
      | {
          tense: Tense;
          question?: boolean;
          negative?: false | "not";
          nounPhraseFor?: string | null;
        }
      | Tense = "simple_present"
  ): PredicateSyntaxParse | null {
    // De-structure arguments
    if (typeof options == "string") options = { tense: options as Tense };
    const {
      tense,
      question = false,
      negative = false,
      nounPhraseFor = null,
    } = options;

    // First parse verb-phrase, getting the subject.
    // TODO: Add indexing here to make more efficient
    let reg = this.composeVerbPhraseRegex({
      tense,
      question,
      negative,
      nounPhraseFor,
    });
    if (!nounPhraseFor || nounPhraseFor == "subject")
      reg = initialAndWholeWord(reg);
    else reg = wholeWord(reg);

    let verbPhraseParse = reg.exec(str);

    if (verbPhraseParse) {
      let [verbPhrase, subject] = verbPhraseParse;
      let afterVerb = str
        .slice(verbPhraseParse.index + verbPhrase.length)
        .trim();

      let assoc = this.parsePrepositions(afterVerb);
      if (!assoc) return null;

      // If parsing for a noun phrase form, read the part in front of the verb phrase
      if (nounPhraseFor && nounPhraseFor != "subject") {
        let preVerb = str.slice(0, verbPhraseParse.index).trim();
        // Exit early if preverb is missing.
        if (!preVerb) return null;
        else assoc[nounPhraseFor] = preVerb;
      }

      // Get the subject argument
      if (this.includesSubject) assoc.subject = subject;

      // Check there is the correct number of arguments
      if (Object.keys(assoc).length != this.numberOfArgs) return null;

      return {
        syntaxKind: "predicate_syntax",
        args: this.orderArgs(assoc),
        syntax: this,
        tense,
        question,
        negative,
        nounPhraseFor: nounPhraseFor
          ? this.paramIndex[nounPhraseFor].index
          : null,
        from: 0,
        to: str.length,
        str,
        pos: nounPhraseFor ? "NP" : "S",
      };
    } else return null;
  }

  parsePrepositions(afterVerb: string) {
    let argList: string[] = [];
    let argNames = ["object"];

    let prepParse;
    let strIdx = 0;
    let i = 0;

    // Parse the prepositional arguments
    if (this.prepositionRegex)
      while ((prepParse = this.prepositionRegex.exec(afterVerb))) {
        argList[i] = afterVerb.slice(strIdx, prepParse.index).trim();
        argNames[i + 1] = prepParse[0];
        // Exit early if parse finds a rogue direct object or absence thereof.
        if (i == 0) {
          if (!this.includesObject && argList[i].length != 0) return null;
          else if (this.includesObject && argList[i].length == 0) return null;
        }

        strIdx = prepParse.index + prepParse[0].length;
        ++i;
      }

    argList.push(afterVerb.slice(strIdx).trim());

    if (!this.includesObject) {
      argList.shift();
      argNames.shift();
    }

    // Create an associative object of the arguments.
    let assoc: { [key: string]: string } = {};
    for (let i in argList) {
      // Exit with null if duplicate preposition found.
      if (assoc[argNames[i]]) return null;
      assoc[argNames[i]] = argList[i];
    }

    return assoc;
  }

  composeVerbPhraseRegex(options: {
    tense: Tense;
    question: boolean;
    negative?: false | "not";
    nounPhraseFor?: string | null;
  }) {
    // De-structure options.
    const {
      tense,
      question = false,
      negative = false,
      nounPhraseFor = null,
    } = options;

    // First check the index.
    let formSymbol = sentenceFormSymbol({
      tense,
      question,
      negative,
      nounPhraseFor,
    });
    if (this.regexIndex[formSymbol]) return this.regexIndex[formSymbol];

    if (nounPhraseFor && question)
      throw "Arguments `question` & `nounPhraseFor` are incompatible.";

    let verb = verbToTense(this.infinitive, tense);
    if (negative == "not") verb = makeNegative(verb);

    let result;
    if (question) {
      if (tense == "simple_past")
        result = simplePastQuestionTemplate(this.infinitive, negative).regex();
      else result = questionRegex(verb);
    } else if (nounPhraseFor == "subject")
      result = new Template(`_ which <${verb}`).regex();
    else if (nounPhraseFor == "object")
      result = new Template(`which _ <${verb}`).regex();
    else if (nounPhraseFor)
      result = new Template(`${nounPhraseFor} which _ <${verb}`).regex();
    else result = new Template(`_ <${verb}`).regex();

    this.regexIndex[formSymbol] = result;
    return result;
  }

  str(
    args: string[],
    options:
      | {
          tense?: Tense;
          question?: boolean;
          negative?: false | "not";
          nounPhraseFor?: string | number;
        }
      | Tense = {}
  ) {
    if (typeof options == "string") options = { tense: options };
    const {
      tense = "simple_present",
      question = false,
      negative = false,
    } = options;
    let assoc = this.associateArgs(args);

    let nounPhraseFor: string | null;
    if (typeof options.nounPhraseFor == "string")
      nounPhraseFor = options.nounPhraseFor;
    else if (typeof options.nounPhraseFor == "number")
      nounPhraseFor = this.params[options.nounPhraseFor].name;
    else nounPhraseFor = null;

    return composeSentence({
      tense,
      infinitive: this.infinitive,
      ...assoc,
      question,
      negative,
      nounPhraseFor,
    });
  }

  /**
   * Convert associative arguments into ordered argument list
   */
  orderArgs(assoc: { [key: string]: string }) {
    let ordered = [];
    for (let key in assoc) ordered[this.paramIndex[key].index] = assoc[key];

    return ordered;
  }

  /**
   * Convert ordered argument list into an associative argument object.
   */
  associateArgs(ordered: string[]) {
    let assoc: { [key: string]: string } = {};
    for (let i in ordered) {
      assoc[this.params[i].name] = ordered[i];
    }
    return assoc;
  }

  /**
   * Check to see if a string includes the verb in any conjugation.
   * This can be used to quickly determine whether its worth doing a
   * full parse.
   */
  quickCheck(str: string) {
    return this.quickCheckRegex.test(str);
  }

  /**
   * Get the logical predicate that corresponds to this PredicateSyntax object.
   */
  get predicate() {
    return createPredicateSyntaxPredicate({
      verb: this.infinitive,
      params: this.params.map((p) => p.name),
    });
  }
}

function composeQuickCheckRegex(infinitive: string) {
  const [firstWord, remainder] = shiftWord(infinitive);

  return wholeWord(
    remainder
      ? concat(anyConjugationRegex(firstWord), /(?: [\w\s]+)?/, ` ${remainder}`)
      : anyConjugationRegex(firstWord)
  );
}
