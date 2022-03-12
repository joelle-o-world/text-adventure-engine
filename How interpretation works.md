## How natural language sentences are interpreted as formal logic

POS-tagging:
 - The sentence is split into a list of words
 - For each word the parts of speech are fetched from WordNet.
   Morphological transformations are also explored to match non-baseform
   words. What about multi-word parts of speech??

Context free grammar analysis
 - a CFG parse table is created, assigning non-terminal symbols
   for each POS tag and terminal symbols for each literal word.
 - This table is fed into the PredicateSyntaxGrammar
 - This produces a forest of parse trees

Logical interpretation
 - For each tree in the forest
   - The tree is "evaluated". Each rule in the grammar has an evaluate
     function which takes as arguments the evaluation of sub symbols.
   - In the case of PredicateSyntaxGrammar this yields an object a like,
    ```ts
      {
        kind: "predicateSyntax",
        verb: string, // infinitive
        params: string[],
        args: string[],
        tense: Tense
      }
    ```
 - ...


