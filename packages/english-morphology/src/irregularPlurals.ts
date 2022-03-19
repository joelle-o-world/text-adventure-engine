export const irregularPlurals: { [singular: string]: string } = {
  sheep: "sheep",
  woman: "women",
  man: "men",
};

export const irregularSingulars = Object.entries(irregularPlurals).reduce(
  (prev, [key, val]) => ({
    ...prev,
    [val]: key,
  }),
  {} as { [plural: string]: string }
);
