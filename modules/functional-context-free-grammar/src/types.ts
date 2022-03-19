export interface Rule {
  src?: string;
  id?: number | string;
  ruleFunction?: unknown;
}

export interface TerminalRule<
  TerminalSymbol,
  NonTerminalSymbol = TerminalSymbol
> extends Rule {
  head: NonTerminalSymbol;
  body: TerminalSymbol;
}

export interface NonTerminalRule<
  TerminalSymbol,
  NonTerminalSymbol = TerminalSymbol
> extends Rule {
  head: NonTerminalSymbol;
  body: [NonTerminalSymbol, NonTerminalSymbol];
}

/**
 * A context free grammar in chomsky normal form
 */
export interface ContextFreeGrammar<
  TerminalSymbol = string,
  NonTerminalSymbol = TerminalSymbol
> {
  nonTerminalRules: NonTerminalRule<TerminalSymbol, NonTerminalSymbol>[];
  terminalRules: TerminalRule<TerminalSymbol, NonTerminalSymbol>[];
  startingSymbol?: NonTerminalSymbol;
}

export interface ParseTreeSymbol {
  from: number;
  to: number;
  S: string;
}

export interface AnnotatedTree<Terminal = string, NonTerminal = Terminal> {
  head: NonTerminal;
  body: (Terminal | AnnotatedTree<Terminal, NonTerminal>)[];
  ruleId?: number | string;
}
