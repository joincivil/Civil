import * as React from "react";
import {
  PAYMENTS_STRIPE_MUTATION,
  SET_EMAIL_MUTATION,
  GET_STRIPE_PAYMENT_INTENT,
  CREATE_PAYMENT_METHOD,
  CLONE_PAYMENT_METHOD,
} from "./queries";
import { injectStripe, ReactStripeElements } from "react-stripe-elements";
import styled from "styled-components";
import { PaymentsFormWrapper } from "./PaymentsFormWrapper";
import { CivilContext, ICivilContext } from "../context";
import { isValidEmail } from "@joincivil/utils";
import { RadioInput, RadioButtonStandard } from "@joincivil/elements";
import {
  PaymentTerms,
  PaymentBtn,
  PaymentInputLabel,
  PaymentError,
  CheckboxContainer,
  CheckboxSection,
  CheckboxLabel,
} from "./PaymentsStyledComponents";
import {
  PayWithCardText,
  PaymentStripeNoticeText,
  PaymentTermsText,
  PaymentErrorText,
} from "./PaymentsTextComponents";
import { INPUT_STATE } from "./types";
import { Checkbox, CheckboxSizes } from "../input";
import { PaymentStripeFormSavedCard } from "./PaymentsStripeFormSavedCard";
import ApolloClient from "apollo-client";
import { PaymentsStripeCardComponent } from "./PaymentsStripeCardComponent";

export interface PaymentIntentsStripeFormProps extends ReactStripeElements.InjectedStripeProps {
  postId: string;
  newsroomName: string;
  shouldPublicize: boolean;
  userEmail?: string;
  userChannelID?: string;
  paymentMethods?: any[];
  usdToSpend: number;
  apolloClient: ApolloClient<any>;
  paymentIntentsEnabled: boolean;
  stripeApiKey: string;
  connectedStripeAccountID: string;
  handlePaymentSuccess(userSubmittedEmail: boolean, didSaveEmail: boolean): void;
  handleEditPaymentType(): void;
}

export interface PaymentIntentsStripeFormStates {
  email: string;
  emailState: string;
  name: string;
  nameState: string;
  cardInfoState: string;
  isPaymentError: boolean;
  paymentProcessing: boolean;
  wasEmailPrepopulated: boolean;
  promptSaveEmail: boolean;
  shouldSaveEmailToAccount: boolean;
  shouldAddEmailToMailingList: boolean;
  shouldSaveCCToAccount: boolean;
  displayStripeErrorMessage: string;
  payWithNewCard: boolean;
  paymentMethodId: string;
  defaultPaymentMethodId: string;
  hasSavedPaymentMethod: boolean;
}

class PaymentIntentsStripeForm extends React.Component<PaymentIntentsStripeFormProps, PaymentIntentsStripeFormStates> {
  public static contextType = CivilContext;
  public context!: ICivilContext;

  constructor(props: any) {
    super(props);
    const defaultPaymentMethodId =
      props.paymentMethods && props.paymentMethods.length > 0 ? props.paymentMethods[0].paymentMethodID : "";
    this.state = {
      email: props.userEmail || "",
      wasEmailPrepopulated: props.userEmail ? true : false,
      promptSaveEmail: !props.userEmail && props.userChannelID ? true : false,
      emailState: this.props.userEmail ? INPUT_STATE.VALID : INPUT_STATE.EMPTY,
      name: "",
      nameState: INPUT_STATE.EMPTY,
      cardInfoState: INPUT_STATE.EMPTY,
      isPaymentError: false,
      paymentProcessing: false,
      shouldSaveEmailToAccount: true,
      shouldAddEmailToMailingList: false,
      shouldSaveCCToAccount: false,
      displayStripeErrorMessage: "",
      payWithNewCard: false,
      paymentMethodId: defaultPaymentMethodId,
      defaultPaymentMethodId,
      hasSavedPaymentMethod: props.paymentMethods && props.paymentMethods.length > 0,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public render(): JSX.Element {
    const showCreditCardForm = !this.state.hasSavedPaymentMethod || this.state.payWithNewCard;

    return (
      <>
        <PaymentsFormWrapper
          handleEditPaymentType={this.props.handleEditPaymentType}
          payWithText={<PayWithCardText />}
          paymentNoticeText={<PaymentStripeNoticeText />}
          showSecureIcon={true}
        >
          {this.props.paymentIntentsEnabled && this.state.defaultPaymentMethodId !== "" && (
            <RadioInput
              name={"Save Credit Card"}
              label=""
              onChange={this.handleSavedCreditCard}
              defaultValue={this.state.defaultPaymentMethodId}
            >
              {this.props.paymentMethods!.map(pm => {
                return (
                  <RadioButtonStandard value={pm.paymentMethodID}>
                    <PaymentStripeFormSavedCard
                      cardDetails={pm.brand + " " + pm.last4Digits}
                      date={pm.expMonth + "/" + pm.expYear}
                    />
                  </RadioButtonStandard>
                );
              })}

              <RadioButtonStandard value={"new card"}>Pay with a new credit card</RadioButtonStandard>
            </RadioInput>
          )}
          {showCreditCardForm && (
            <>
            <PaymentsStripeCardComponent
              email={this.state.email}
              wasEmailPrepopulated={this.state.wasEmailPrepopulated}
              emailState={this.state.emailState}
              nameState={this.state.nameState}
              cardInfoState={this.state.cardInfoState}
              displayStripeErrorMessage={this.state.displayStripeErrorMessage}
              handleOnBlur={this.handleOnBlur}
              handleStripeChange={this.handleStripeChange}
            />
              {this.props.userChannelID && this.props.userChannelID !== "" && (
                <>
                  <PaymentInputLabel>Remember Credit Card</PaymentInputLabel>
                  <CheckboxContainer>
                    <CheckboxSection>
                      <label>
                        <Checkbox
                          size={CheckboxSizes.SMALL}
                          checked={this.state.shouldSaveCCToAccount}
                          onClick={this.toggleShouldSaveCCToAccount}
                        />
                        <CheckboxLabel>Save my credit card information for future Boosts payments</CheckboxLabel>
                      </label>
                    </CheckboxSection>
                  </CheckboxContainer>
                </>
              )}
            </>
          )}
        </PaymentsFormWrapper>
        {this.state.promptSaveEmail && this.state.emailState === INPUT_STATE.VALID && (
          <>
            <CheckboxContainer>
              <CheckboxSection>
                <label>
                  <Checkbox
                    size={CheckboxSizes.SMALL}
                    checked={this.state.shouldSaveEmailToAccount}
                    onClick={this.toggleShouldSaveEmailToAccount}
                  />
                  <CheckboxLabel>Save my email to my Civil account.</CheckboxLabel>
                </label>
              </CheckboxSection>
            </CheckboxContainer>
            <CheckboxContainer>
              <CheckboxSection>
                <label>
                  <Checkbox
                    size={CheckboxSizes.SMALL}
                    checked={this.state.shouldAddEmailToMailingList}
                    onClick={this.toggleShouldAddEmailToMailingList}
                  />
                  <CheckboxLabel>Receive the Civil Weekly newsletter in my inbox.</CheckboxLabel>
                </label>
              </CheckboxSection>
            </CheckboxContainer>
          </>
        )}
        <PaymentBtn onClick={() => this.handleSubmit()} disabled={this.disableBoostBtn()}>
          {this.state.paymentProcessing ? "Payment processing..." : "Complete Boost"}
        </PaymentBtn>
        {this.state.isPaymentError && (
          <PaymentError>
            <PaymentErrorText />
          </PaymentError>
        )}
        <PaymentTerms>
          <PaymentTermsText />
        </PaymentTerms>
      </>
    );
  }

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

  private disableBoostBtn = () => {
    const disableBoostBtn =
      this.state.emailState === INPUT_STATE.VALID &&
      this.state.nameState === INPUT_STATE.VALID &&
      this.state.cardInfoState === INPUT_STATE.VALID &&
      this.state.paymentProcessing === false
        ? false
        : true;

    return disableBoostBtn && !this.state.paymentMethodId;
  };

  private toggleShouldSaveCCToAccount = () => {
    this.setState({ shouldSaveCCToAccount: !this.state.shouldSaveCCToAccount });
  };

  private toggleShouldSaveEmailToAccount = () => {
    this.setState({ shouldSaveEmailToAccount: !this.state.shouldSaveEmailToAccount });
  };

  private toggleShouldAddEmailToMailingList = () => {
    this.setState({ shouldAddEmailToMailingList: !this.state.shouldAddEmailToMailingList });
  };

  private handleSavedCreditCard = (name: string, value: any) => {
    if (value === "new card") {
      this.setState({ payWithNewCard: true, paymentMethodId: "" });
    } else {
      this.setState({ payWithNewCard: false, paymentMethodId: value });
    }
  };

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

  private async handleChargePayment(): Promise<boolean> {
    try {
      const token = await this.props.stripe!.createToken({
        name: this.state.name,
      });
      await this.props.apolloClient.mutate({
        mutation: PAYMENTS_STRIPE_MUTATION,
        variables: {
          postID: this.props.postId,
          input: {
            // @ts-ignore
            paymentToken: token.token.id,
            amount: this.props.usdToSpend,
            currencyCode: "usd",
            emailAddress: this.state.email,
            shouldPublicize: this.props.shouldPublicize,
            payerChannelID: this.props.userChannelID,
          },
        },
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  private async clonePaymentMethodAndPayViaIntent(
    paymentMethodID: string,
    clonePayerChannelID?: string,
  ): Promise<boolean> {
    try {
      const cloneVariables = {
        postID: this.props.postId,
        input: {
          payerChannelID: clonePayerChannelID,
          paymentMethodID,
          amount: 0,
          currencyCode: "usd",
        },
      };
      const cloneResult = await this.props.apolloClient.mutate({
        mutation: CLONE_PAYMENT_METHOD,
        variables: cloneVariables,
      });
      if (cloneResult.error) {
        console.error(cloneResult.error)
      }
      const pamentMethodID2 = (cloneResult as any).data.paymentsClonePaymentMethod.paymentMethodID;

      const paymentIntentVariables = {
        postID: this.props.postId,
        input: {
          amount: this.props.usdToSpend,
          currencyCode: "usd",
          emailAddress: this.state.email,
          shouldPublicize: this.props.shouldPublicize,
          payerChannelID: this.props.userChannelID,
        },
      };

      const paymentIntent = await this.props.apolloClient.mutate({
        mutation: GET_STRIPE_PAYMENT_INTENT,
        variables: paymentIntentVariables,
      });
      if (paymentIntent.error) {
        console.error(paymentIntent.error);
        return false;
      }
      const paymentIntentSecret = (paymentIntent as any).data.paymentsCreateStripePaymentIntent.clientSecret;

      const connectedAccountStripe = window.Stripe(this.props.stripeApiKey, {
        stripeAccount: this.props.connectedStripeAccountID,
      });

      const piResult = await connectedAccountStripe.confirmCardPayment(paymentIntentSecret, {
        payment_method: pamentMethodID2,
      });
      if (piResult.error) {
        console.error(piResult.error);
        return false;
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  private async savePaymentMethodThenCloneAndPayViaIntent(): Promise<boolean> {
    try {
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
        return false;
      }
      return this.clonePaymentMethodAndPayViaIntent(
        paymentMethodResult.data.paymentsCreateStripePaymentMethod.paymentMethodID,
        this.props.userChannelID,
      );
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  private async useOneTimePaymentIntent(): Promise<boolean> {
    try {
      const result = await (this.props.stripe as any).createPaymentMethod({
        type: "card",
        card: (this.props as any).elements.getElement("card"),
        billing_details: {
          name: this.state.name,
          email: this.state.email,
        },
      });

      const paymentMethodID = result.paymentMethod.id;
      return this.clonePaymentMethodAndPayViaIntent(paymentMethodID);
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  private async handleSubmit(): Promise<void> {
    this.context.fireAnalyticsEvent("boost", "Stripe submit clicked", this.props.postId, this.props.usdToSpend);
    this.setState({ paymentProcessing: true, isPaymentError: false });
    let didSaveEmail = false;
    if (this.state.promptSaveEmail && this.state.email && this.state.shouldSaveEmailToAccount) {
      didSaveEmail = true;
      const variables = {
        input: {
          emailAddress: this.state.email,
          channelID: this.props.userChannelID,
          addToMailing: this.state.shouldAddEmailToMailingList,
        },
      };
      await this.props.apolloClient.mutate({
        mutation: SET_EMAIL_MUTATION,
        variables,
      });
    }
    let success = false;

    const cardFormVisible = !this.state.hasSavedPaymentMethod || this.state.payWithNewCard;
    if (this.props.stripe) {
      if (!this.props.paymentIntentsEnabled) {
        success = await this.handleChargePayment();
      } else if (this.state.paymentMethodId !== "") {
        success = await this.clonePaymentMethodAndPayViaIntent(this.state.paymentMethodId, this.props.userChannelID);
      } else if (cardFormVisible && this.state.shouldSaveCCToAccount) {
        success = await this.savePaymentMethodThenCloneAndPayViaIntent();
      } else {
        success = await this.useOneTimePaymentIntent();
      }
    }
    if (success) {
      this.context.fireAnalyticsEvent(
        "boost",
        "Stripe transaction confirmed",
        this.props.postId,
        this.props.usdToSpend,
      );
      this.props.handlePaymentSuccess(this.state.email !== "" && true, didSaveEmail);
    } else {
      this.context.fireAnalyticsEvent("boost", "Stripe transaction rejected", this.props.postId, this.props.usdToSpend);
      this.setState({ paymentProcessing: false, isPaymentError: true });
    }
  }
}

export default injectStripe(PaymentIntentsStripeForm);
