export * from "regops";

export function wholeWord(operand: RegExp | string) {
  let source = operand instanceof RegExp ? operand.source : operand;

  return new RegExp("(?<=\\s|^)(?:" + source + ")(?=\\s|$)");
}

export function g(operand: RegExp | string) {
  let source = operand instanceof RegExp ? operand.source : operand;

  return new RegExp(source, "g");
}

export function caseInsensitive(operand: RegExp | string) {
  let source = operand instanceof RegExp ? operand.source : operand;

  return new RegExp(source, "i");
}

export function initialAndWholeWord(operand: RegExp | string) {
  let source = operand instanceof RegExp ? operand.source : operand;

  return new RegExp(`^(?:${source})(?=\\s|$)`);
}

export function lookAhead(operand: RegExp | string) {
  let source = operand instanceof RegExp ? operand.source : operand;
  return new RegExp(`(?=${source})`);
}
