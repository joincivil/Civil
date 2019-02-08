import * as React from "react";

export interface CurrencyCVLTextProps {
  pricePerCvl: number;
  totalPrice: number;
}

export const CurrencyCVLPriceText: React.SFC<CurrencyCVLTextProps> = props => (
  <>
    <span>You are buying</span>
    <h4>{props.totalPrice} CVL</h4>
    <p>approx. @ ${props.pricePerCvl} per CVL</p>
  </>
);
