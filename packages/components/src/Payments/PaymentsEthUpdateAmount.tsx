import * as React from "react";
import { UsdEthConverter } from "../";
import { PaymentBtn } from "./PaymentsStyledComponents";
import { NotEnoughETHInWalletText } from "./PaymentsTextComponents";

export interface PaymentsEthUpdateAmountProps {
  etherToSpend: number;
  usdToSpend: number;
  handleBoostUpdate(newUsdToSpend: number, selectedUsdToSpend: number, etherToSpend: number): void;
}

export interface PaymentsEthUpdateAmountStates {
  etherToSpend: number;
  usdToSpend: number;
  notEnoughEthError: boolean;
}

export class PaymentsEthUpdateAmount extends React.Component<
  PaymentsEthUpdateAmountProps,
  PaymentsEthUpdateAmountStates
> {
  public constructor(props: PaymentsEthUpdateAmountProps) {
    super(props);
    this.state = {
      etherToSpend: this.props.etherToSpend,
      usdToSpend: this.props.usdToSpend,
      notEnoughEthError: false,
    };
  }

  public render(): JSX.Element {
    return (
      <>
        <NotEnoughETHInWalletText />
        <UsdEthConverter
          fromValue={this.state.usdToSpend.toString()}
          onNotEnoughEthError={(error: boolean) => this.notEnoughEthError(error)}
          onConversion={(usd: number, eth: number) => this.setConvertedAmount(usd, eth)}
        />
        <PaymentBtn
          onClick={() =>
            this.props.handleBoostUpdate(this.state.usdToSpend, this.props.usdToSpend, this.state.etherToSpend)
          }
          disabled={this.state.notEnoughEthError}
        >
          Update Boost Amount
        </PaymentBtn>
      </>
    );
  }

  private setConvertedAmount(usdToSpend: number, etherToSpend: number): void {
    const eth = parseFloat(etherToSpend.toFixed(6));
    this.setState({ usdToSpend, etherToSpend: eth });
  }

  private notEnoughEthError = (error: boolean) => {
    this.setState({ notEnoughEthError: error });
  };
}
