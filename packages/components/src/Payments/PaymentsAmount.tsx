import * as React from "react";
import {
  PaymentBtn,
  PaymentAmountUserOptions,
  PaymentAmountUserInput,
  PaymentsShowInputBtn,
  PaymentDirectionsStyled,
  PaymentAmountUserComment,
} from "./PaymentsStyledComponents";
import { SelectPaymentAmountText, EnterCustomAmountText, PublicizeUserText } from "./PaymentsTextComponents";
import { PaymentsRadio } from "./PaymentsRadio";
import { RadioInput, CurrencyInput, TextareaInput } from "@joincivil/elements";
import { Checkbox, CheckboxSizes } from "../input";

export interface SuggestedAmounts {
  amount: string;
}

export interface PaymentsAmountProps {
  newsroomName: string;
  suggestedAmounts: SuggestedAmounts[];
  handleAmount(usdToSpend: number, shouldPublicize: boolean, comment: string): void;
}

export interface PaymentsAmountStates {
  showInput: boolean;
  shouldPublicizeChecked: boolean;
  shouldPublicize: boolean;
  usdToSpend: number;
  comment: string;
}

export class PaymentsAmount extends React.Component<PaymentsAmountProps, PaymentsAmountStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      showInput: false,
      shouldPublicizeChecked: false,
      shouldPublicize: true,
      usdToSpend: 0,
      comment: "",
    };
  }

  public render(): JSX.Element {
    const disableNext = this.state.usdToSpend === 0;
    return (
      <>
        <PaymentDirectionsStyled>
          <SelectPaymentAmountText />
        </PaymentDirectionsStyled>
        <RadioInput onChange={this.handleRadioSelection} label="" name="SuggestedAmounts">
          {this.props.suggestedAmounts.map((item, i) => (
            <PaymentsRadio value={item.amount} key={i}>
              ${item.amount}
              <span>USD</span>
            </PaymentsRadio>
          ))}
        </RadioInput>
        <PaymentAmountUserInput>
          {this.state.showInput ? (
            <CurrencyInput icon={<>$</>} name="CurrencyInput" onChange={this.handleAmountInput} />
          ) : (
            <PaymentsShowInputBtn onClick={this.handleShowInput}>
              <EnterCustomAmountText />
            </PaymentsShowInputBtn>
          )}
        </PaymentAmountUserInput>
        <PaymentAmountUserComment>
          <TextareaInput
            label=""
            height="85"
            maxLength="140"
            placeholder="Add a message with your Boost…"
            name="UserComment"
            onChange={this.handleCommentInput}
          />
        </PaymentAmountUserComment>
        <PaymentAmountUserOptions>
          <Checkbox
            id="shouldPublicize"
            onClick={this.handleCheckBox}
            checked={this.state.shouldPublicizeChecked}
            size={CheckboxSizes.SMALL}
          />
          <label htmlFor="shouldPublicize">
            <PublicizeUserText />
          </label>
        </PaymentAmountUserOptions>
        <PaymentBtn
          onClick={() => this.props.handleAmount(this.state.usdToSpend, this.state.shouldPublicize, this.state.comment)}
          disabled={disableNext}
        >
          Next
        </PaymentBtn>
      </>
    );
  }

  private handleShowInput = () => {
    this.setState({ showInput: true });
  };

  private handleCheckBox = () => {
    this.setState({
      shouldPublicizeChecked: !this.state.shouldPublicizeChecked,
      shouldPublicize: !this.state.shouldPublicize,
    });
  };

  private handleRadioSelection = (name: string, value: any) => {
    this.setState({ usdToSpend: value });
  };

  private handleAmountInput = (name: string, value: any) => {
    this.setState({ usdToSpend: value });
  };

  private handleCommentInput = (name: string, value: any) => {
    this.setState({ comment: value });
  };
}
