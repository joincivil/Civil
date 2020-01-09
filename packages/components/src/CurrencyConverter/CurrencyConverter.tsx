import * as React from "react";
import {
  CurrencyConverterContain,
  CurrencyContain,
  CurrencyLabel,
  StyledCurrencyInputWithButton,
  CurrencyErrorMsg,
  CurrencyIconContain,
} from "./CurrencyConverterStyledComponents";
import { ExchangeArrowsIcon, WarningIcon } from "../icons";
import { CurrencyConverted } from "./CurrencyConverted";
import { CurrencyInputWithoutButton } from "../input";
import { debounce } from "lodash";
import { CivilContext, ICivilContext } from "../context";
import { colors } from "../styleConstants";

export interface CurrencyConverterProps {
  currencyCodeFrom: string;
  currencyLabelFrom?: string | JSX.Element;
  currencyCodeTo: string;
  currencyLabelTo?: string | JSX.Element;
  displayErrorMsg?: boolean;
  fromValue?: string;
  className?: string;
  doConversion(fromValue: number): Promise<number>;
  onConversion(fromValue: number, toValue: number): void;
  onNotEnoughEthError?(error: boolean): void;
}

export interface CurrencyConverterState {
  fromValue: number;
  toValue: number;
  balance: number;
  enoughEthError: boolean;
}

export class CurrencyConverter extends React.Component<CurrencyConverterProps, CurrencyConverterState> {
  public static contextType = CivilContext;
  public context!: ICivilContext;

  private handleConversionDebounced: (fromValueString: string) => Promise<void>;
  constructor(props: any) {
    super(props);
    this.state = {
      fromValue: 0,
      toValue: 0,
      balance: 0,
      enoughEthError: false,
    };

    this.handleConversionDebounced = debounce(this.handleConversion.bind(this), 500, { maxWait: 2000 });
  }

  public async componentDidMount(): Promise<void> {
    const civil = this.context.civil;
    if (this.props.fromValue) {
      await this.handleConversionDebounced(this.props.fromValue);
    }
    if (civil) {
      await civil.currentProviderEnable();
      const account = await civil.accountStream.first().toPromise();
      if (account) {
        await this.setState({
          balance: await civil.accountBalance(account),
        });
        // Now that we have balance we should do conversion again where we check if they have enough ETH for it
        if (this.props.fromValue) {
          await this.handleConversion(this.props.fromValue);
        }
      }
    }
  }

  public render(): JSX.Element {
    return (
      <CurrencyConverterContain className={this.props.className}>
        <CurrencyContain>
          <CurrencyLabel>{this.props.currencyLabelFrom}</CurrencyLabel>
          <StyledCurrencyInputWithButton>
            <CurrencyInputWithoutButton
              name="Convert currency"
              icon={<>{this.props.currencyCodeFrom}</>}
              onChange={async (_, amount) => this.handleConversionDebounced(amount)}
              value={this.props.fromValue}
            />
          </StyledCurrencyInputWithButton>
        </CurrencyContain>
        <CurrencyIconContain>
          <ExchangeArrowsIcon />
        </CurrencyIconContain>
        <CurrencyContain>
          <CurrencyLabel>{this.props.currencyLabelTo}</CurrencyLabel>
          <CurrencyConverted currentPrice={this.state.toValue} currencyCode={this.props.currencyCodeTo} />
        </CurrencyContain>

        {this.props.displayErrorMsg && this.state.enoughEthError && this.renderErrorMsg()}
      </CurrencyConverterContain>
    );
  }

  private async handleConversion(fromValueString: string): Promise<void> {
    let fromValue = Number.parseFloat(fromValueString);
    if (isNaN(fromValue)) {
      fromValue = 0;
    }
    const toValue = await this.props.doConversion(fromValue);
    const enoughEthError = toValue > this.state.balance ? true : false;
    this.onNotEnoughEthError(enoughEthError);
    const nextState = { fromValue, toValue, enoughEthError };
    this.setState(nextState);
    this.props.onConversion(nextState.fromValue, nextState.toValue);
  }

  private onNotEnoughEthError = (error: boolean) => {
    if (this.props.onNotEnoughEthError) {
      this.props.onNotEnoughEthError(error);
    }
  };

  private renderErrorMsg = () => {
    return (
      <CurrencyErrorMsg>
        <WarningIcon color={colors.accent.CIVIL_RED} height={15} width={15} />
        <p>You don’t have enough ETH in your wallet.</p>
      </CurrencyErrorMsg>
    );
  };
}
