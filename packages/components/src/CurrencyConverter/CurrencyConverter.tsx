import * as React from "react";
import {
  CurrencyConverterContain,
  CurrencyContain,
  CurrencyLabel,
  StyledCurrencyInputWithButton,
  CurrencyIconContain,
} from "./CurrencyConverterStyledComponents";
import { ExchangeArrowsIcon } from "../icons";
import { CurrencyConverted } from "./CurrencyConverted";
import { CurrencyInputWithoutButton } from "../input";
import { debounce } from "lodash";

export interface CurrencyConverterProps {
  currencyCodeFrom: string;
  currencyLabelFrom?: string | JSX.Element;
  currencyCodeTo: string;
  currencyLabelTo?: string | JSX.Element;
  errorMsg?: string;
  getError?: boolean;
  doConversion(fromValue: number): Promise<number>;
  onConversion(fromValue: number, toValue: number): void;
}

export interface CurrencyConverterState {
  fromValue: number;
  toValue: number;
}

export class CurrencyConverter extends React.Component<CurrencyConverterProps, CurrencyConverterState> {
  private handleConversionDebounced: (fromValueString: string) => Promise<void>;
  constructor(props: any) {
    super(props);
    this.state = {
      fromValue: 0,
      toValue: 0,
    };

    this.handleConversionDebounced = debounce(this.handleConversion.bind(this), 500, { maxWait: 2000 });
  }

  public render(): JSX.Element {
    return (
      <CurrencyConverterContain>
        <CurrencyContain>
          <CurrencyLabel>{this.props.currencyLabelFrom}</CurrencyLabel>
          <StyledCurrencyInputWithButton>
            <CurrencyInputWithoutButton
              name="Convert currency"
              icon={<>{this.props.currencyCodeFrom}</>}
              onChange={async (_, amount) => this.handleConversionDebounced(amount)}
            />
          </StyledCurrencyInputWithButton>
        </CurrencyContain>
        <CurrencyIconContain>
          <ExchangeArrowsIcon />
        </CurrencyIconContain>
        <CurrencyContain>
          <CurrencyLabel>{this.props.currencyLabelTo}</CurrencyLabel>
          <CurrencyConverted
            currentPrice={this.state.toValue}
            currencyCode={this.props.currencyCodeTo}
            errorMsg={this.props.errorMsg}
            getError={this.props.getError}
          />
        </CurrencyContain>
      </CurrencyConverterContain>
    );
  }

  private async handleConversion(fromValueString: string): Promise<void> {
    let fromValue = Number.parseFloat(fromValueString);
    if (isNaN(fromValue)) {
      fromValue = 0;
    }
    const toValue = await this.props.doConversion(fromValue);
    const nextState = { fromValue, toValue };
    this.setState(nextState);
    this.props.onConversion(nextState.fromValue, nextState.toValue);
  }
}
