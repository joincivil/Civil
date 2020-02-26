import * as React from "react";
import { PaymentsStripeCardComponent, Button, buttonSizes, InvertedButton, PageHeadingLeftAligned, PageHeadingTextLeftAligned } from "@joincivil/components";
import { isValidEmail } from "@joincivil/utils";
import { injectStripe, ReactStripeElements } from "react-stripe-elements";
import ApolloClient from "apollo-client";
import { CREATE_PAYMENT_METHOD } from "@joincivil/components/src/Payments/queries";
import styled from "styled-components";

export interface AccountAddCardProps extends ReactStripeElements.InjectedStripeProps {
  userEmail: string;
  userChannelID: string;
  apolloClient: ApolloClient<any>;
  handleCancel(): void;
  handleAdded(): void;
}

export interface AccountAddCardState {
  email: string;
  emailState: string;
  name: string;
  nameState: string;
  cardInfoState: string;
  wasEmailPrepopulated: boolean;
  displayStripeErrorMessage: string;
  addCardDisabled: boolean;
}

enum INPUT_STATE {
  EMPTY = "empty",
  VALID = "valid",
  INVALID = "invalid",
}

const ButtonDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const SaveButton = styled(Button)`
  margin-left: 10px;
`;

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
      addCardDisabled: false,
    };
  }

  public render(): JSX.Element {
    return (
      <div>
        <PageHeadingLeftAligned>Add Card</PageHeadingLeftAligned>
        <PageHeadingTextLeftAligned>Add a credit or debit card as a payment method.</PageHeadingTextLeftAligned>
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
          showAddCardText={true}
        />
        <ButtonDiv>
          <InvertedButton onClick={this.props.handleCancel} size={buttonSizes.SMALL}>
            Cancel
          </InvertedButton>
          <SaveButton onClick={this.handleAddCard} disabled={this.state.addCardDisabled} size={buttonSizes.SMALL}>
            Save
          </SaveButton>
        </ButtonDiv>
      </div>
    );
  }

  private handleAddCard = async () => {
    try {
      this.setState({addCardDisabled: true});
      const result = await (this.props.stripe as any).createPaymentMethod({
        type: "card",
        card: (this.props as any).elements.getElement("card"),
        billing_details: {
          name: this.state.name,
          email: this.state.email,
        },
      });

      const paymentMethodID = result.paymentMethod.id;

      const paymentMethodVariables = {
        input: {
          paymentMethodID,
          emailAddress: this.state.email,
          payerChannelID: this.props.userChannelID,
        },
      };

      const paymentMethodResult = await this.props.apolloClient.mutate({
        mutation: CREATE_PAYMENT_METHOD,
        variables: paymentMethodVariables,
      });
      if (paymentMethodResult.error) {
        console.error(paymentMethodResult.error);
        this.setState({ addCardDisabled: false });
      }
      this.props.handleAdded();
      this.setState({addCardDisabled: false});
    } catch (err) {
      this.setState({addCardDisabled: false});
    }
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
