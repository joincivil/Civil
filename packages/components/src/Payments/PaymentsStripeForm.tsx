import * as React from "react";
import {
  PAYMENTS_STRIPE_MUTATION,
  SET_EMAIL_MUTATION,
  GET_STRIPE_PAYMENT_INTENT,
  CREATE_PAYMENT_METHOD,
  CLONE_PAYMENT_METHOD,
} from "./queries";
import { injectStripe, ReactStripeElements, CardElement } from "react-stripe-elements";
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
  PaymentEmailConfirmationText,
  PaymentTermsText,
  PaymentErrorText,
  PaymentEmailPrepopulatedText,
} from "./PaymentsTextComponents";
import {
  InputValidationUI,
  InputStripeValidationUI,
  StripeElement,
  InputErrorMessage,
} from "./PaymentsInputValidationUI";
import { INPUT_STATE } from "./types";
import { Checkbox, CheckboxSizes } from "../input";
import { PaymentStripeFormSavedCard } from "./PaymentsStripeFormSavedCard";
import ApolloClient from "apollo-client";

const StripeWrapper = styled.div`
  margin: 20px 0 0;
  max-width: 500px;
  width: 100%;
`;

export interface PaymentStripeFormProps extends ReactStripeElements.InjectedStripeProps {
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
  handlePaymentSuccess(userSubmittedEmail: boolean, didSaveEmail: boolean): void;
  handleEditPaymentType(): void;
}

export interface PaymentStripeFormStates {
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

class PaymentStripeForm extends React.Component<PaymentStripeFormProps, PaymentStripeFormStates> {
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
    const showCreditCardForm = !this.props.paymentIntentsEnabled || !this.state.hasSavedPaymentMethod || this.state.payWithNewCard;

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
              <StripeWrapper>
                {this.state.wasEmailPrepopulated && <PaymentEmailPrepopulatedText email={this.state.email} />}
                {!this.state.wasEmailPrepopulated && (
                  <>
                    <PaymentInputLabel>Email</PaymentInputLabel>
                    <InputValidationUI inputState={this.state.emailState}>
                      <input
                        defaultValue={this.state.email}
                        id="email"
                        name="email"
                        type="email"
                        maxLength={254}
                        onBlur={() => this.handleOnBlur(event)}
                      />
                      <PaymentEmailConfirmationText />
                    </InputValidationUI>
                  </>
                )}
                <PaymentInputLabel>Name on card</PaymentInputLabel>
                <InputValidationUI inputState={this.state.nameState}>
                  <input id="name" name="name" onBlur={() => this.handleOnBlur(event)} required />
                </InputValidationUI>
                <PaymentInputLabel>Card information</PaymentInputLabel>
                <InputStripeValidationUI inputState={this.state.cardInfoState}>
                  <StripeElement inputState={this.state.cardInfoState}>
                    <CardElement
                      id="card-info"
                      style={{ base: { fontSize: "13px" } }}
                      onChange={this.handleStripeChange}
                    />
                  </StripeElement>
                  {this.state.displayStripeErrorMessage !== "" && (
                    <InputErrorMessage>{this.state.displayStripeErrorMessage}</InputErrorMessage>
                  )}
                </InputStripeValidationUI>
              </StripeWrapper>
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

  private async clonePaymentMethodAndPayViaIntent(paymentMethodID: string): Promise<boolean> {
    try {
      const cloneVariables = {
        postID: this.props.postId,
        input: {
          payerChannelID: this.props.userChannelID,
          paymentMethodID,
          amount: 0,
          currencyCode: "usd",
        },
      };
      const cloneResult = await this.props.apolloClient.mutate({
        mutation: CLONE_PAYMENT_METHOD,
        variables: cloneVariables,
      });
      console.log("cloneResult: ", cloneResult);
      const pamentMethodID2 = (cloneResult as any).data.paymentsCloneCustomerPaymentMethod.paymentMethodID;

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
      console.log("paymentIntent: ", paymentIntent);
      const paymentIntentSecret = (paymentIntent as any).data.paymentsCreateStripePaymentIntent.clientSecret;

      // @types for stripe-react-elements are out of date, so have to cast stripe props to any
      const piResult = await(this.props.stripe as any).confirmCardPayment(paymentIntentSecret, {
        payment_method: pamentMethodID2,
      });
      console.log("piResult: ", piResult);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  private async savePaymentMethodThenCloneAndPayViaIntent(): Promise<boolean> {
    try {
      console.log("props:", this.props);
      const platformStripe = window.Stripe(this.props.stripeApiKey, { stripeAccount: "acct_1BbHH2I7gPEo6b55" });
      const result = await(platformStripe as any).createPaymentMethod({
        type: "card",
        card: (this.props as any).elements.getElement("card"),
        billing_details: {
          name: this.state.name,
          email: this.state.email,
        },
      });
      console.log("result: ", result);

      const paymentMethodId = result.paymentMethod.id;

      const paymentMethodVariables = {
        input: {
          paymentMethodID: paymentMethodId,
          emailAddress: this.state.email,
          payerChannelID: this.props.userChannelID,
        },
      };

      const paymentMethodResult = await this.props.apolloClient.mutate({
        mutation: CREATE_PAYMENT_METHOD,
        variables: paymentMethodVariables,
      });
      console.log("paymentMethod: ", paymentMethodResult);
      return this.clonePaymentMethodAndPayViaIntent(paymentMethodResult.paymentMethod.id);
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
    if (this.props.stripe) {
      if (!this.props.paymentIntentsEnabled) {
        success = await this.handleChargePayment();
      } else if (this.state.paymentMethodId !== "") {
        success = await this.clonePaymentMethodAndPayViaIntent(this.state.paymentMethodId);
      } else if (this.state.payWithNewCard && this.state.shouldSaveCCToAccount) {
        success = await this.savePaymentMethodThenCloneAndPayViaIntent();
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

export default injectStripe(PaymentStripeForm);
