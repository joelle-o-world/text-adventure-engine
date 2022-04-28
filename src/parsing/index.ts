import { evaluateTree } from "context-free-grammar";
import { preparePosTagParseTable } from "pos-tagging";
import {
  NounPhraseParse,
  PredicateSyntaxParse,
  assertIsPredicateSyntaxParse,
  assertIsNounPhraseParse,
  PredicateSyntaxGrammar,
} from "preset-grammars";
import { NounPhraseGrammar } from "preset-grammars";

// NOTE: Keep updating this function with whatever is the best version
export async function* parseNounPhrase(
  str: string
): AsyncGenerator<NounPhraseParse> {
  const words = str.split(" ");
  const preParseTable = await preparePosTagParseTable(words);
  const forest = NounPhraseGrammar.parse(words, preParseTable);
  for (let tree of forest.recursiveTrees()) {
    const parse = evaluateTree(tree);
    if (assertIsNounPhraseParse(parse)) yield parse;
  }
}

// NOTE: Keep updating this function with whatever is the best version
export async function* parseSentence(
  str: string
): AsyncGenerator<PredicateSyntaxParse> {
  const words = str.split(" ");
  const preParseTable = await preparePosTagParseTable(words);
  const forest = PredicateSyntaxGrammar.parse(words, preParseTable);
  for (let tree of forest.recursiveTrees()) {
    const parse = evaluateTree(tree);
    if (assertIsPredicateSyntaxParse(parse)) yield parse;
  }
}
