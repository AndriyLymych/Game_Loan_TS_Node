export const calculateCartHelper = (obj: any): number => {
  return obj.games.reduce((previousValue: number, currentValue: any) => {
    previousValue += currentValue.loan_time * currentValue.gameId.price;

    return previousValue;
  }, 0);
};
