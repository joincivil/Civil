export const SuggestedPaymentAmounts = [{ amount: "1" }, { amount: "2" }, { amount: "3" }, { amount: "5" }];

export enum PAYMENT_STATE {
  SELECT_AMOUNT,
  SELECT_PAYMENT_TYPE,
  ETH_PAYMENT,
  STRIPE_PAYMENT,
  PAYMENT_SUCCESS,
}