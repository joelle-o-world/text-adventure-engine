import PredicateSyntax from "predicate-syntax";
import {
  isPronounParse,
  isSimpleNounPhraseParse,
  NounPhraseParse,
  SimpleNounPhraseParse,
} from "preset-grammars";
import { suggestSyntax } from "suggest-predicate-syntax";
import { parseNounPhrase } from "../../../src/parsing/index";
import { wheelCombinations } from "combinatorics";

export async function* interpretSentenceAsAnnotationLogic(sentence: string) {
  for await (let syntax of suggestSyntax(sentence)) {
    const predicateSyntax = new PredicateSyntax(syntax.verb, syntax.params);
    const mainSentence = predicateSyntax.toAnnotationLogic();

    for (let { tense, args: rawArgs } of predicateSyntax.parse(sentence)) {
      const statement = `${tense} [${mainSentence}]`;

      const argInterpretations = await Promise.all(
        rawArgs.map((arg) => collect(interpretNounPhrase(arg)))
      );

      for (let combination of wheelCombinations(...argInterpretations))
        yield [statement, ...combination];
    }
  }

  return [];
}

async function collect(generator: AsyncGenerator) {
  const arr = [];
  for await (let value of generator) arr.push(value);
  return arr;
}

let i = 0;
export async function* interpretNounPhrase(
  nounPhrase: string,
  arg = `y${++i}`
): AsyncGenerator<string[]> {
  for await (let parse of parseNounPhrase(nounPhrase)) {
    for (let interpretation of interpretNounPhraseParse(parse, arg))
      yield interpretation;
  }
}

export function interpretNounPhraseParse(
  parse: NounPhraseParse,
  entity: string
) {
  if (isSimpleNounPhraseParse(parse))
    return interpretSimpleNounPhraseParse(parse, entity);
  else if (isPronounParse(parse)) return [[]];
  else throw "unimplemented";
}

function* interpretSimpleNounPhraseParse(
  parse: SimpleNounPhraseParse,
  entity: string
) {
  yield [
    `[${entity}] is a ${parse.noun}`,
    ...parse.adjectives.map((adjective) => `[${entity}] is ${adjective}`),
  ];
}
