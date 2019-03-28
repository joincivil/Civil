import { analyticsEvent } from "./analytics";

/*
Account Created (GA)
Purchases - Open Market (GA)
Purchases - Foundation (GA)
Tutorial Complete (GA)
*/

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

export const tokenPurchase = (type: "Open Market" | "Foundation", amount: number) =>
  analyticsEvent({
    category,
    action: `Token Purcase`,
    label: type,
    value: amount,
  });

export const tutorialComplete = () =>
  analyticsEvent({
    category,
    action: `Tutorial`,
    label: "Complete",
  });
