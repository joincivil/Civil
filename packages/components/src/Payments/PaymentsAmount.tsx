import * as React from "react";
import {
  PaymentBtn,
  PaymentAmountUserOptions,
  PaymentAmountUserInput,
  PaymentGhostBtn,
  PaymentDirectionsStyled,
} from "./PaymentsStyledComponents";
import { SelectPaymentAmountText, EnterCustomAmountText, PublicizeUserText } from "./PaymentsTextComponents";
import { PaymentsRadio } from "./PaymentsRadio";
import { RENDER_CONTEXT, CivilContext, ICivilContext } from "../context";
import { RadioInput, CurrencyInput } from "@joincivil/elements";
import { Checkbox, CheckboxSizes } from "../input";

export interface SuggestedAmounts {
  amount: string;
}

export interface PaymentsAmountProps {
  newsroomName: string;
  suggestedAmounts: SuggestedAmounts[];
  handleAmount(usdToSpend: number, shouldPublicize: boolean): void;
}

export interface PaymentsAmountStates {
  showInput: boolean;
  shouldPublicizeChecked: boolean;
  shouldPublicize: boolean;
  usdToSpend: number;
}

export class PaymentsAmount extends React.Component<PaymentsAmountProps, PaymentsAmountStates> {
  public static contextType = CivilContext;
  public static context: ICivilContext;

  constructor(props: any) {
    super(props);
    this.state = {
      showInput: false,
      shouldPublicizeChecked: false,
      shouldPublicize: true,
      usdToSpend: 0,
    };
  }

  public render(): JSX.Element {
    const disableNext = this.state.usdToSpend === 0;
    return (
      <>
        {(!this.context || this.context.renderContext !== RENDER_CONTEXT.EMBED) && (
          <PaymentDirectionsStyled>
            <SelectPaymentAmountText />
          </PaymentDirectionsStyled>
        )}
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
            <PaymentGhostBtn onClick={this.handleShowInput}>
              <EnterCustomAmountText />
            </PaymentGhostBtn>
          )}
        </PaymentAmountUserInput>
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
          onClick={() => this.props.handleAmount(this.state.usdToSpend, this.state.shouldPublicize)}
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
}
