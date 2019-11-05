import { Sentence, Predicate, Entity } from "./logic";
import { Template } from "./Template";
import { Dictionary } from "./Dictionary";
import { parseNoun } from "./parsing/parseNoun";
import { parseArticle, parsePossessive, parseDemonstrative } from "./parsing/parseArticle";

let mySentence = new Sentence(
  new Predicate('Drinks'),
  new Entity('cat'),
  new Entity('milk'),
)



console.log(mySentence.symbol);


const dict = new Dictionary()
  .addNouns(
    "cat", "dog", "mullet", "buzz cut"
  )

console.log(
    parseNoun(dict, "my hairy buzz cut")
)

console.log(
  parseArticle("the hairy mullet"),
  parsePossessive('my hairy mullet'),
  parseDemonstrative('that hairy mullet')
)