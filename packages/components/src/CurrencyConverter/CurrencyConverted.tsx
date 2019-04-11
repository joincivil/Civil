import * as React from "react";
import { CurrencyConvertedBox, CurrencyCode, CurrencyErrorMsg } from "./CurrencyConverterStyledComponents";
import { WarningIcon } from "../icons";
import { colors } from "../styleConstants";

export interface CurrencyConvertedProps {
  currencyCode?: string | JSX.Element;
  currentPrice?: number;
  errorMsg?: string;
  getError?: boolean;
}

export interface CurrencyConvertedStates {
  convertedCurrency?: number;
}

export class CurrencyConverted extends React.Component<CurrencyConvertedProps, CurrencyConvertedStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      convertedCurrency: this.props.currentPrice || 0,
    };
  }

  public render(): JSX.Element {
    return (
      <>
        <CurrencyConvertedBox>
          {this.props.currentPrice}
          <CurrencyCode>{this.props.currencyCode}</CurrencyCode>
        </CurrencyConvertedBox>
        {this.props.getError && this.renderErrorMsg(this.props.errorMsg || "Error")}
      </>
    );
  }

  private renderErrorMsg = (errorMsg: string) => {
    return (
      <CurrencyErrorMsg>
        <WarningIcon color={colors.accent.CIVIL_RED} height={15} width={15} />
        <p>{errorMsg}</p>
      </CurrencyErrorMsg>
    );
  };
}
