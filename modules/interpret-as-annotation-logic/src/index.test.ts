import { interpretSentenceAsAnnotationLogic } from ".";

test("first test", async () => {
  for (let phrase of ["I put the pineapple on the table"])
    for await (let interpretation of interpretSentenceAsAnnotationLogic(phrase))
      console.log(interpretation);
});
