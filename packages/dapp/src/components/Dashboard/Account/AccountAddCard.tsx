import * as React from "react";
import { PaymentsStripeCardComponent } from "@joincivil/components";
import { isValidEmail } from "@joincivil/utils";
import { injectStripe, ReactStripeElements } from "react-stripe-elements";

export interface AccountAddCardProps extends ReactStripeElements.InjectedStripeProps {
  userEmail: string;
}

export interface AccountAddCardState {
  email: string;
  emailState: string;
  name: string;
  nameState: string;
  cardInfoState: string;
  wasEmailPrepopulated: boolean;
  displayStripeErrorMessage: string;
}

enum INPUT_STATE {
  EMPTY = "empty",
  VALID = "valid",
  INVALID = "invalid",
}

class AccountAddCard extends React.Component<AccountAddCardProps, AccountAddCardState> {

  constructor(props: AccountAddCardProps) {
    super(props);
    this.state = {
      email: props.userEmail || "",
      wasEmailPrepopulated: props.userEmail ? true : false,
      emailState: this.props.userEmail ? INPUT_STATE.VALID : INPUT_STATE.EMPTY,
      name: "",
      nameState: INPUT_STATE.EMPTY,
      cardInfoState: INPUT_STATE.EMPTY,
      displayStripeErrorMessage: "",
    };
  }

  public render(): JSX.Element {
    return (
      <div>
        <PaymentsStripeCardComponent
          email={this.state.email}
          emailState={this.state.emailState}
          name={this.state.name}
          nameState={this.state.nameState}
          cardInfoState={this.state.cardInfoState}
          wasEmailPrepopulated={this.state.wasEmailPrepopulated}
          displayStripeErrorMessage={this.state.displayStripeErrorMessage}
          handleOnBlur={this.handleOnBlur}
          handleStripeChange={this.handleStripeChange}
        />
      </div>
    );
  }

  private handleOnBlur = (event: any) => {
    const state = event.target.id;
    const value = event.target.value;

    switch (state) {
      case "email":
        const validEmail = isValidEmail(value);
        validEmail
          ? this.setState({ email: value, emailState: INPUT_STATE.VALID })
          : this.setState({ emailState: INPUT_STATE.INVALID });
        break;
      case "name":
        const validName = value !== "";
        validName
          ? this.setState({ name: value, nameState: INPUT_STATE.VALID })
          : this.setState({ nameState: INPUT_STATE.INVALID });
        break;
      default:
        break;
    }
  };

  private handleStripeChange = (event: any) => {
    const stripeElements = document.querySelectorAll(".StripeElement");
    let displayStripeErrorMessage = "";

    if (event.error) {
      displayStripeErrorMessage = event.error.message;
    }

    stripeElements.forEach(element => {
      const classList = element.classList;
      if (classList.contains("StripeElement--invalid")) {
        this.setState({ cardInfoState: INPUT_STATE.INVALID, displayStripeErrorMessage });
      } else if (classList.contains("StripeElement--empty")) {
        this.setState({ cardInfoState: INPUT_STATE.EMPTY, displayStripeErrorMessage });
      } else {
        this.setState({ cardInfoState: INPUT_STATE.VALID, displayStripeErrorMessage });
      }
    });
  };
}

export default injectStripe(AccountAddCard);
