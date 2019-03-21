import * as React from "react";
import { CurrencyCalcCVL } from "../CurrencyConverter";
export interface TokenPurchaseSummaryProps {
  mode: "buy" | "sell";
  currencyCode: string;
  pricePer: number;
  totalTokens: number;
  totalPrice?: number;
  zeroValue?: string;
}
function round(amount: number | undefined): number | string {
  return amount ? Math.round(amount * 1000) / 1000 : 0;
}
export const TokenPurchaseSummary = (props: TokenPurchaseSummaryProps) => {
  const { mode, currencyCode, totalPrice, totalTokens, pricePer } = props;

  return (
    <CurrencyCalcCVL>
      <span>You are {mode === "buy" ? "buying" : "selling"}</span>
      <h4>
        {round(totalTokens)} {currencyCode}
      </h4>
      {totalTokens > 0 ? (
        <p>
          approx. ${round(totalPrice)} @ ${round(pricePer)} per {currencyCode}
        </p>
      ) : null}
    </CurrencyCalcCVL>
  );
};
