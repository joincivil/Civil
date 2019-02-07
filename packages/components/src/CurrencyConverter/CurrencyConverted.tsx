import * as React from "react";
import { CurrencyConvertedBox, CurrencyCode } from "./CurrencyConverterStyledComponents";

export interface CurrencyConvertedProps {
  currencyCode?: string | JSX.Element;
  placeholder?: string;
}

export interface CurrencyConvertedStates {
  convertedCurrency?: string;
}

export class CurrencyConverted extends React.Component<CurrencyConvertedProps, CurrencyConvertedStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      convertedCurrency: this.props.placeholder || "0",
    };
  }

  public render(): JSX.Element {
    return (
      <CurrencyConvertedBox>
        {this.props.placeholder}
        <CurrencyCode>{this.props.currencyCode}</CurrencyCode>
      </CurrencyConvertedBox>
    );
  }
}
