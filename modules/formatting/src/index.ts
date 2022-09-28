export function bulletPoints(
  messages: string[],
  bullet: string = " - ",
  doubleSpace = true
) {
  return messages
    .map((message) => {
      const [firstLine, ...subsequentLines] = splitLines(message);
      return (
        bullet +
        firstLine +
        subsequentLines.map((line: string) => " ".repeat(bullet.length) + line)
      );
    })
    .join(doubleSpace ? "\n\n" : "\n");
}

export function splitLines(str: string) {
  return str.split("\n");
}
