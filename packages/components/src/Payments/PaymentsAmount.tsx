import * as React from "react";
import {
  PaymentBtn,
  PaymentAmountHeader,
  PaymentAmountInfo,
  PaymentAmountUserOptions,
  PaymentAmountUserInput,
} from "./PaymentsStyledComponents";
import { PaymentsRadio } from "./PaymentsRadio";
import { RadioInput, CurrencyInput } from "@joincivil/elements";
import { Checkbox, CheckboxSizes } from "../input";

export interface SuggestedAmounts {
  amount: string;
}

export interface PaymentsAmountProps {
  newsroomName: string;
  suggestedAmounts: SuggestedAmounts[];
  handleAmount(usdToSpend: number, hideUserName: boolean): void;
}

export interface PaymentsAmountStates {
  hideUserName: boolean;
  usdToSpend: number;
}

export class PaymentsAmount extends React.Component<PaymentsAmountProps, PaymentsAmountStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      hideUserName: false,
      usdToSpend: 0,
    };
  }

  public render(): JSX.Element {
    const disableNext = this.state.usdToSpend === 0;
    return (
      <>
        <PaymentAmountHeader>Send a tip to Coda Story</PaymentAmountHeader>
        <PaymentAmountInfo>Your tip goes directly to their newsroom account.</PaymentAmountInfo>
        <RadioInput onChange={this.handleRadioSelection} label="" name="SuggestedAmounts">
          {this.props.suggestedAmounts.map((item, i) => (
            <PaymentsRadio value={item.amount} key={i}>
              ${item.amount}
              <span>USD</span>
            </PaymentsRadio>
          ))}
        </RadioInput>
        <PaymentAmountUserInput>
          <CurrencyInput icon={<></>} name="CurrencyInput" onChange={this.handleInput} />
        </PaymentAmountUserInput>
        <PaymentAmountUserOptions>
          <Checkbox
            id="hideUserName"
            onClick={this.handleCheckBox}
            checked={this.state.hideUserName}
            size={CheckboxSizes.SMALL}
          />
          <label htmlFor="hideUserName">Hide my username from the contributor list</label>
        </PaymentAmountUserOptions>
        <PaymentBtn
          onClick={() => this.props.handleAmount(this.state.usdToSpend, this.state.hideUserName)}
          disabled={disableNext}
        >
          Continue
        </PaymentBtn>
      </>
    );
  }

  private handleCheckBox = () => {
    this.setState({ hideUserName: !this.state.hideUserName });
  };

  private handleRadioSelection = (name: string, value: any) => {
    this.setState({ usdToSpend: value });
  };

  private handleInput = (name: string, value: any) => {
    this.setState({ usdToSpend: value });
  };
}
