import { analyticsEvent } from "./analytics";

const category = "Token Storefront";

export const accountCreated = () =>
  analyticsEvent({
    category,
    action: "Account Created",
  });

export const accountLogin = () =>
  analyticsEvent({
    category,
    action: "Account Login",
  });

export enum TokenPurchaseType {
  OPEN_MARKET = "Open Market",
  FOUNDATION = "Foundation",
}

export const tokenPurchase = (type: TokenPurchaseType, amount: number) =>
  analyticsEvent({
    category,
    action: `Token Purchase`,
    label: type,
    value: amount,
  });

export const tutorialComplete = () =>
  analyticsEvent({
    category,
    action: `Tutorial`,
    label: "Complete",
  });
