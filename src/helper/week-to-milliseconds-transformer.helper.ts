export const weekToMillisecondsTransformerHelper = (weeksCount: number) => {
  return weeksCount * 1000 * 60 * 60 * 24 * 7;
};
