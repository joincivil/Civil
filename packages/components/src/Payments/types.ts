export const SuggestedPaymentAmounts = [{ amount: "1" }, { amount: "2" }, { amount: "3" }, { amount: "5" }];

export enum PAYMENT_STATE {
  SELECT_AMOUNT,
  PAYMENT_CHOOSE_LOGIN_OR_GUEST,
  SELECT_PAYMENT_TYPE,
  ETH_PAYMENT,
  STRIPE_PAYMENT,
  APPLE_PAY,
  GOOGLE_PAY,
  PAYMENT_SUCCESS,
}

export enum INPUT_STATE {
  EMPTY = "empty",
  VALID = "valid",
  INVALID = "invalid",
}

export interface CivilUserData {
  email: string;
  ethAddress: string;
  userChannel: {
    tiny72AvatarDataUrl: string;
  };
}
