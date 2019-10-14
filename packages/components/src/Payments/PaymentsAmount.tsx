import * as React from "react";
import { PaymentBtn } from "./PaymentsStyledComponents";
import { PaymentsRadio } from "./PaymentsRadio";
import { RadioInput } from "@joincivil/elements";
import { Checkbox, CheckboxSizes } from "../input";

export interface SuggestedAmounts {
  amount: string;
}

export interface PaymentsAmountProps {
  newsroomName: string;
  suggestedAmounts: SuggestedAmounts[];
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
    return (
      <>
        <h2>Send a tip to Coda Story</h2>
        <p>Your tip goes directly to their newsroom account.</p>
        <RadioInput onChange={this.handleRadioSelection} label="" name="SuggestedAmounts">
          {this.props.suggestedAmounts.map((item, i) => (
            <PaymentsRadio value={item.amount} key={i}>
              ${item.amount}
              <span>USD</span>
            </PaymentsRadio>
          ))}
        </RadioInput>
        <div>
          <Checkbox
            id="hideUsername"
            onClick={this.handleCheckBox}
            checked={this.state.hideUserName}
            size={CheckboxSizes.SMALL}
          />
          <label htmlFor="hideUsername">Hide my username from the contributor list</label>
        </div>
        <PaymentBtn>Continue</PaymentBtn>
      </>
    );
  }

  private handleCheckBox = () => {
    this.setState({ hideUserName: !this.state.hideUserName });
  };

  private handleRadioSelection = (name: string, value: any) => {
    this.setState({ usdToSpend: value });
  };

  private handleInput = (amount: number) => {
    this.setState({ usdToSpend: amount });
  };
}
