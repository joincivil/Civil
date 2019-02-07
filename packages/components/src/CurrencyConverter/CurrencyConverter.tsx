import * as React from "react";
import {
  CurrencyConverterContain,
  CurrencyContain,
  CurrencyLabel,
  StyledCurrencyInputWithButton,
  CurrencyIconContain,
} from "./CurrencyConverterStyledComponents";
import { ExchangeArrowsIcon } from "../icons/ExchangeArrowsIcon";
import { CurrencyInputWithButton } from "../input/InputWithButton";
import { CurrencyConverted } from "./CurrencyConverted";

export interface CurrencyConverterProps {
  currencyLabelLeft?: string | JSX.Element;
  currencyLabelRight?: string | JSX.Element;
}

export const CurrencyConverter: React.StatelessComponent<CurrencyConverterProps> = props => {
  return (
    <CurrencyConverterContain>
      <CurrencyContain>
        <CurrencyLabel>{props.currencyLabelLeft}</CurrencyLabel>
        <StyledCurrencyInputWithButton>
          <CurrencyInputWithButton
            placeholder="0.00"
            name="CurrencyInputWithButton"
            onChange={() => console.log("CurrencyInputWithButton change")}
            buttonText="Convert"
            icon={<>USD</>}
            onButtonClick={() => console.log("CurrencyInputWithButton clicked")}
          />
        </StyledCurrencyInputWithButton>
      </CurrencyContain>
      <CurrencyIconContain>
        <ExchangeArrowsIcon />
      </CurrencyIconContain>
      <CurrencyContain>
        <CurrencyLabel>{props.currencyLabelRight}</CurrencyLabel>
        <CurrencyConverted placeholder="0" currencyCode={"ETH"} />
      </CurrencyContain>
    </CurrencyConverterContain>
  );
};
