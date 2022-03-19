import Grammar from "./Grammar";

/**
 * A grammara production rule in the form A -> B where A is non-terminal and B is terminal.
 */
export interface TerminalRule<
  TerminalSymbol,
  NonTerminalSymbol = TerminalSymbol
> {
  head: NonTerminalSymbol;
  body: TerminalSymbol;
  F: (terminal: TerminalSymbol) => any;
}

/** Test whether an object is a valid TerminalRule. */
export function isTerminalRule<T, NT>(
  o: any,
  isTerminalSymbol: (S: any) => S is T,
  isNonTerminalSymbol: (S: any) => S is NT
): o is TerminalRule<T, NT> {
  return (
    isNonTerminalSymbol(o.head) &&
    isTerminalSymbol(o.body) &&
    typeof o.F == "function"
  );
}

/**
 * A grammar production rule in the form `A -> B C` where A, B, C are all non-terminal symbols.
 */
export interface NonTerminalRule<
  TerminalSymbol,
  NonTerminalSymbol = TerminalSymbol
> {
  head: NonTerminalSymbol;
  body: [NonTerminalSymbol, NonTerminalSymbol];
  F: (a: any, b: any) => any;
}

/**
 * Test whether an object is a valid NonTerminalRule.
 */
export function isNonTerminalRule<T, NT>(
  o: any,
  isTerminalSymbol: (S: any) => S is T,
  isNonTerminalSymbol: (S: any) => S is NT
): o is NonTerminalRule<T, NT> {
  return (
    isNonTerminalSymbol(o.head) &&
    o.body instanceof Array &&
    o.body.length == 2 &&
    isNonTerminalSymbol(o.body[0]) &&
    isNonTerminalSymbol(o.body[1]) &&
    typeof o.F == "function"
  );
}

/**
 * A grammar production rule in the form A -> B where both A and B are non-terminal. This allows for a handy extension from the Chomsky Normal Form, at the cost of slightly reduced efficiency.
 */
export interface AliasRule<TerminalSymbol, NonTerminalSymbol = TerminalSymbol> {
  head: NonTerminalSymbol;
  body: NonTerminalSymbol;
  F: (a: any) => any;
}

/**
 * Test whether an object is a valid AliasRule.
 */
export function isAliasRule<T, NT>(
  o: any,
  isTerminalSymbol: (S: any) => S is T,
  isNonTerminalSymbol: (S: any) => S is NT
) {
  return (
    isNonTerminalSymbol(o.head) &&
    isNonTerminalSymbol(o.body) &&
    typeof o.F == "function"
  );
}

/**
 * Shorthand type for TerminalRule|NonTerminalRule|AliasRule.
 */
export type AnyRule<TerminalSymbol, NonTerminalSymbol = TerminalSymbol> =
  | TerminalRule<TerminalSymbol, NonTerminalSymbol>
  | NonTerminalRule<TerminalSymbol, NonTerminalSymbol>
  | AliasRule<TerminalSymbol, NonTerminalSymbol>;

export interface ParseTreeTerminalSymbol<
  TerminalSymbol,
  NonTerminalSymbol = TerminalSymbol
> {
  from: number;
  to: number;
  S: TerminalSymbol;
}
export interface ParseTreeNonTerminalSymbol<
  TerminalSymbol,
  NonTerminalSymbol = TerminalSymbol
> {
  from: number;
  to: number;
  S: NonTerminalSymbol;
}

export type ParseTreeSymbol<
  TerminalSymbol = string,
  NonTerminalSymbol = TerminalSymbol
> =
  | ParseTreeTerminalSymbol<TerminalSymbol, NonTerminalSymbol>
  | ParseTreeNonTerminalSymbol<TerminalSymbol, NonTerminalSymbol>;

export type ParseForest<
  TerminalSymbol = string,
  NonTerminalSymbol = TerminalSymbol
> = Grammar<
  ParseTreeTerminalSymbol<TerminalSymbol, NonTerminalSymbol>,
  ParseTreeNonTerminalSymbol<TerminalSymbol, NonTerminalSymbol>
>;

export type ParseTable<TerminalSymbol, NonTerminalSymbol = TerminalSymbol> = [
  number,
  NonTerminalSymbol,
  number,
  ((...args: any) => any)?
][];

export interface TypeAssertions {
  [stringifiedSymbol: string]: (parse: any) => boolean;
}
