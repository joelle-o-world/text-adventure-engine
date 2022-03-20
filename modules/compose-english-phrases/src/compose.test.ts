import composeSentence from "./compose";

test("Composing sentences", () => {
  expect(
    composeSentence({
      infinitive: "take",
      tense: "simple_present",
      subject: "Polly",
      object: "her grandma",
      to: "the shops",
    })
  ).toBe("Polly takes her grandma to the shops");

  expect(
    composeSentence({
      infinitive: "be",
      subject: "I",
      object: "amazing",
      tense: "simple_present",
    })
  ).toBe("I am amazing");

  expect(
    composeSentence({
      infinitive: "play",
      subject: "you",
      tense: "simple_past",
    })
  ).toBe("you played");

  expect(
    composeSentence({
      infinitive: "play",
      subject: "I",
      tense: "simple_past",
    })
  ).toBe("I played");

  expect(
    composeSentence({
      infinitive: "play",
      subject: "he",
      tense: "simple_past",
    })
  ).toBe("he played");

  expect(
    composeSentence({
      infinitive: "play",
      subject: "she",
      tense: "simple_past",
    })
  ).toBe("she played");
});

test("Composing negatives", () => {
  expect(
    composeSentence({
      infinitive: "take",
      tense: "simple_present",
      subject: "Polly",
      object: "her grandma",
      to: "the shops",
      negative: "not",
    })
  ).toBe("Polly does not take her grandma to the shops");

  expect(
    composeSentence({
      infinitive: "be",
      subject: "I",
      object: "amazing",
      tense: "simple_present",
      negative: "not",
    })
  ).toBe("I am not amazing");
});

test("Composing questions", () => {
  expect(
    composeSentence({
      infinitive: "take",
      tense: "simple_present",
      subject: "Polly",
      object: "her grandma",
      to: "the shops",
      question: true,
    })
  ).toBe("does Polly take her grandma to the shops");

  expect(
    composeSentence({
      infinitive: "be",
      subject: "I",
      object: "amazing",
      tense: "simple_present",
      question: true,
    })
  ).toBe("am I amazing");

  expect(
    composeSentence({
      infinitive: "take",
      tense: "simple_present",
      subject: "Polly",
      object: "her grandma",
      to: "the shops",
      negative: "not",
      question: true,
    })
  ).toBe("does Polly not take her grandma to the shops");

  expect(
    composeSentence({
      infinitive: "be",
      subject: "I",
      object: "amazing",
      tense: "simple_present",
      negative: "not",
      question: true,
    })
  ).toBe("am I not amazing");

  expect(
    composeSentence({
      infinitive: "play",
      subject: "he",
      tense: "simple_past",
      question: true,
    })
  ).toBe("did he play");
});

test("Composing noun phrase sentences", () => {
  // NP for subject
  expect(
    composeSentence({
      infinitive: "be aloose",
      subject: "a moose",
      aboot: "this hoose",
      nounPhraseFor: "subject",
    })
  ).toBe("a moose which is aloose aboot this hoose");

  // NP for object
  expect(
    composeSentence({
      infinitive: "nibble",
      subject: "the moose",
      object: "my curtains",
      in: "the living room",
      nounPhraseFor: "object",
    })
  ).toBe("my curtains which the moose nibbles in the living room");

  // NP for prepositions
  expect(
    composeSentence({
      infinitive: "be aloose",
      subject: "a moose",
      aboot: "this hoose",
      nounPhraseFor: "aboot",
    })
  ).toBe("this hoose aboot which a moose is aloose");

  expect(
    composeSentence({
      infinitive: "be aloose",
      subject: "a moose",
      aboot: "this hoose",
      tense: "simple_past",
      nounPhraseFor: "aboot",
    })
  ).toBe("this hoose aboot which a moose was aloose");

  // Negatives
  expect(
    composeSentence({
      infinitive: "be aloose",
      subject: "a moose",
      aboot: "this hoose",
      tense: "simple_present",
      nounPhraseFor: "aboot",
      negative: "not",
    })
  ).toBe("this hoose aboot which a moose is not aloose");
});
