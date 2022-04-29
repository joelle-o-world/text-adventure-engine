import PredicateSyntax from "predicate-syntax";
import { SimpleNounPhraseParse } from "preset-grammars";
import { suggestSyntax } from "suggest-predicate-syntax";
import { parseNounPhrase } from "../../../src/parsing/index";

export async function* interpretSentenceAsAnnotationLogic(sentence: string) {
  for await (let syntax of suggestSyntax(sentence)) {
    const predicateSyntax = new PredicateSyntax(syntax.verb, syntax.params);
    const mainSentence = predicateSyntax.toAnnotationLogic();

    for (let { tense, args: rawArgs } of predicateSyntax.parse(sentence)) {
      const statement = `${tense} [${mainSentence}]`;
      console.log(statement);

      const argInterpretations = await Promise.all(
        rawArgs.map((arg) => interpretNounPhraseAsAnnotationLogic(arg))
      );

      console.log(argInterpretations);
    }
  }

  return [];
}

let i = 0;
export async function interpretNounPhraseAsAnnotationLogic(
  nounPhrase: string,
  arg = `y${++i}`
) {
  const interpretations = [];
  for await (let parse of parseNounPhrase(nounPhrase)) {
    let statements = [];
    const { noun, adjectives } = parse as SimpleNounPhraseParse;
    if (noun) statements.push(`${arg} is a ${noun}`);
    if (adjectives)
      for (let adjective of adjectives)
        statements.push(`${arg} is ${adjective}`);
    interpretations.push(statements);
  }
  return interpretations;
}
