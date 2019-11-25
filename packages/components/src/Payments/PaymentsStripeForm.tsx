import * as React from "react";
import { MutationFunc } from "react-apollo";
import {
  injectStripe,
  ReactStripeElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "react-stripe-elements";
import styled from "styled-components";
import { PaymentsFormWrapper } from "./PaymentsFormWrapper";
import {
  mediaQueries,
  DropdownArrow,
  CCAmexIcon,
  CCDiscoverIcon,
  CCMastercardIcon,
  CCVisaIcon,
  CCSecurityCodeIcon,
} from "@joincivil/elements";
import { CivilContext, ICivilContext } from "../context";
import { isValidEmail, STRIPE_COUNTRIES } from "@joincivil/utils";
import { PaymentTerms, PaymentBtn, PaymentInputLabel, PaymentError } from "./PaymentsStyledComponents";
import {
  PayWithCardText,
  PaymentStripeNoticeText,
  PaymentEmailConfirmationText,
  PaymentTermsText,
  PaymentErrorText,
  PaymentEmailPrepopulatedText,
} from "./PaymentsTextComponents";
import { InputValidationUI, InputValidationStyleProps, StripeElement } from "./PaymentsInputValidationUI";
import { INPUT_STATE } from "./types";

const StripeWrapper = styled.div`
  margin: 20px 0 0;
  max-width: 500px;
  width: 100%;
`;

const StripeCardInfoFlex = styled.div`
  display: flex;

  & > div {
    width: 50%;
  }
`;

const CreditCardIconsWrap = styled.div`
  position: absolute;
  right: ${(props: InputValidationStyleProps) => (props.inputState === INPUT_STATE.INVALID ? "30px" : "10px")};
  top: 13px;

  svg {
    margin-right: 8px;
  }

  ${mediaQueries.MOBILE} {
    right: ${(props: InputValidationStyleProps) => (props.inputState === INPUT_STATE.INVALID ? "25px" : "8px")};

    svg {
      margin-right: 5px;
    }
  }
`;

const CreditCardCVCWrap = styled.div`
  position: absolute;
  right: ${(props: InputValidationStyleProps) => (props.inputState === INPUT_STATE.INVALID ? "30px" : "10px")};
  top: 10px;
`;

const DropDownWrap = styled.div`
  position: absolute;
  right: 10px;
  top: 8px;
  z-index: 0;
`;

export interface PaymentStripeFormProps extends ReactStripeElements.InjectedStripeProps {
  postId: string;
  newsroomName: string;
  shouldPublicize: boolean;
  userEmail?: string;
  userChannelID?: string;
  usdToSpend: number;
  savePayment: MutationFunc;
  handlePaymentSuccess(): void;
  handleEditPaymentType(): void;
}

export interface PaymentStripeFormStates {
  email: string;
  emailState: string;
  name: string;
  nameState: string;
  country: string;
  postalCode: string;
  postalCodeState: string;
  cardNumberState: string;
  cardExpiryState: string;
  cardCVCState: string;
  isPaymentError: boolean;
  paymentProcessing: boolean;
  wasEmailPrepopulated: boolean;
}

class PaymentStripeForm extends React.Component<PaymentStripeFormProps, PaymentStripeFormStates> {
  public static contextType = CivilContext;
  public context!: ICivilContext;
  constructor(props: any) {
    super(props);
    this.state = {
      email: this.props.userEmail || "",
      wasEmailPrepopulated: this.props.userEmail ? true : false,
      emailState: this.props.userEmail ? INPUT_STATE.VALID : INPUT_STATE.EMPTY,
      name: "",
      nameState: INPUT_STATE.EMPTY,
      country: "USA",
      postalCode: "",
      postalCodeState: INPUT_STATE.VALID,
      cardNumberState: INPUT_STATE.EMPTY,
      cardExpiryState: INPUT_STATE.EMPTY,
      cardCVCState: INPUT_STATE.EMPTY,
      isPaymentError: false,
      paymentProcessing: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public render(): JSX.Element {
    return (
      <>
        <PaymentsFormWrapper
          handleEditPaymentType={this.props.handleEditPaymentType}
          payWithText={<PayWithCardText />}
          paymentNoticeText={<PaymentStripeNoticeText />}
          showSecureIcon={true}
        >
          <StripeWrapper>
          {this.state.wasEmailPrepopulated && <PaymentEmailPrepopulatedText email={this.state.email}/>}
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
            </>)}
            <PaymentInputLabel>Card information</PaymentInputLabel>
            <InputValidationUI inputState={this.state.cardNumberState} className={"positionTop"}>
              <StripeElement inputState={this.state.cardNumberState}>
                <CardNumberElement
                  id="card-number"
                  style={{ base: { fontSize: "13px" } }}
                  onBlur={() => this.handleOnBlurStripe()}
                />
              </StripeElement>
              <CreditCardIconsWrap inputState={this.state.cardNumberState}>
                <CCAmexIcon />
                <CCDiscoverIcon />
                <CCMastercardIcon />
                <CCVisaIcon />
              </CreditCardIconsWrap>
            </InputValidationUI>
            <StripeCardInfoFlex>
              <InputValidationUI inputState={this.state.cardExpiryState} className={"positionBottomLeft"}>
                <StripeElement inputState={this.state.cardExpiryState}>
                  <CardExpiryElement
                    id="card-expiry"
                    style={{ base: { fontSize: "13px" } }}
                    onBlur={() => this.handleOnBlurStripe()}
                  />
                </StripeElement>
              </InputValidationUI>
              <InputValidationUI inputState={this.state.cardCVCState} className={"positionBottomRight"}>
                <StripeElement inputState={this.state.cardCVCState}>
                  <CardCvcElement
                    id="card-cvc"
                    style={{ base: { fontSize: "13px" } }}
                    onBlur={() => this.handleOnBlurStripe()}
                  />
                </StripeElement>
                <CreditCardCVCWrap inputState={this.state.cardCVCState}>
                  <CCSecurityCodeIcon />
                </CreditCardCVCWrap>
              </InputValidationUI>
            </StripeCardInfoFlex>
            <PaymentInputLabel>Name on card</PaymentInputLabel>
            <InputValidationUI inputState={this.state.nameState}>
              <input id="name" name="name" onBlur={() => this.handleOnBlur(event)} required />
            </InputValidationUI>
            <PaymentInputLabel>Country or region</PaymentInputLabel>
            <InputValidationUI className={"positionTop"}>
              <select id="country" name="country" onChange={() => this.handleOnBlur(event)}>
                {STRIPE_COUNTRIES.map((country: any, i: number) => {
                  return (
                    <option key={i} value={country.value}>
                      {country.name}
                    </option>
                  );
                })}
              </select>
              <DropDownWrap>
                <DropdownArrow />
              </DropDownWrap>
            </InputValidationUI>
            <InputValidationUI inputState={this.state.postalCodeState} className={"positionBottom"}>
              <input
                id="zip"
                name="zip"
                maxLength={12}
                placeholder="Zip code"
                onBlur={() => this.handleOnBlur(event)}
              />
            </InputValidationUI>
          </StripeWrapper>
        </PaymentsFormWrapper>
        <PaymentBtn onClick={() => this.handleSubmit()} disabled={this.state.paymentProcessing}>
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
      case "zip":
        const validPostalCode = this.isValidPostalCode(value);
        validPostalCode
          ? this.setState({ postalCode: value, postalCodeState: INPUT_STATE.VALID })
          : this.setState({ postalCodeState: INPUT_STATE.INVALID });
        break;
      default:
        break;
    }
  };

  private isValidPostalCode = (inputPostalCode: string) => {
    const postalCode = inputPostalCode.toString().trim();
    const usa = /^[0-9]{5}(?:-[0-9]{4})?$/;
    const can = /^[ABCEGHJKLMNPRSTVXY]\d[ -]?\d[A-Za-z]\d$/;
    const gbr = /^[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}$/i;

    // Stripe recommends getting the zip/postal codes for the US, UK, and Canada
    switch (this.state.country) {
      case "USA":
        return usa.test(postalCode);
      case "CAN":
        return can.test(postalCode);
      case "GBR":
        return gbr.test(postalCode);
      default:
        return true;
    }
  };

  private handleOnBlurStripe = () => {
    const stripeElements = document.querySelectorAll(".StripeElement");

    stripeElements.forEach(element => {
      const id = element.id;
      const classList = element.classList;
      if (classList.contains("StripeElement--invalid")) {
        this.isStripeElementValid(id, INPUT_STATE.INVALID);
      } else if (classList.contains("StripeElement--empty")) {
        this.isStripeElementValid(id, INPUT_STATE.EMPTY);
      } else {
        this.isStripeElementValid(id, INPUT_STATE.VALID);
      }
    });
  };

  private isStripeElementValid = (element: string, state: string) => {
    switch (element) {
      case "card-number":
        this.setState({ cardNumberState: state });
        break;
      case "card-expiry":
        this.setState({ cardExpiryState: state });
        break;
      case "card-cvc":
        this.setState({ cardCVCState: state });
        break;
      default:
        break;
    }
  };

  private async handleSubmit(): Promise<void> {
    if (
      this.state.emailState === INPUT_STATE.VALID &&
      this.state.nameState === INPUT_STATE.VALID &&
      this.state.postalCodeState === INPUT_STATE.VALID &&
      this.state.cardNumberState === INPUT_STATE.VALID &&
      this.state.cardExpiryState === INPUT_STATE.VALID &&
      this.state.cardCVCState === INPUT_STATE.VALID
    ) {
      this.setState({ paymentProcessing: true, isPaymentError: false });
      if (this.props.stripe) {
        try {
          const token = await this.props.stripe.createToken({
            name: this.state.name,
            address_country: this.state.country,
            address_zip: this.state.postalCode,
          });
          await this.props.savePayment({
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
          this.props.handlePaymentSuccess();
        } catch (err) {
          console.error(err);
          this.setState({ paymentProcessing: false, isPaymentError: true });
        }
      }
    }
  }
}

export default injectStripe(PaymentStripeForm);
