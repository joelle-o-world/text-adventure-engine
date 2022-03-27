import TemplateSubstitution from "./TemplateSubstitution";

test("TemplateSubstitution Test 1: Simple", () => {
  expect(new TemplateSubstitution("_ <have a friend in me", "you").str()).toBe(
    "you have a friend in me"
  );
});

test("TemplateSubstitution Test 2: Nested", () => {
  let sub1 = new TemplateSubstitution("_'s _", "I", "cat");
  let sub2 = new TemplateSubstitution("_ <love to be petted", sub1);

  expect(sub2.str()).toBe("my cat loves to be petted");
});
