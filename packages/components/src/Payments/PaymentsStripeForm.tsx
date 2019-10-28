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
import { DropdownArrow, CCAmexIcon, CCDiscoverIcon, CCMastercardIcon, CCVisaIcon, CCSecurityCodeIcon } from "../icons";
import { CivilContext, ICivilContext, mediaQueries } from "../";
import { isValidEmail, STRIPE_COUNTRIES } from "@joincivil/utils";
import { PaymentNotice, PaymentTerms, PaymentBtn, PaymentInputLabel } from "./PaymentsStyledComponents";
import { PaymentStripeNoticeText, PaymentStripeTermsText, PaymentErrorText } from "./PaymentsTextComponents";
import { InputValidationUI, InputValidationStyleProps, StripeElement } from "./PaymentsInputValidationUI";
import { PAYMENT_STATE, INPUT_STATE } from "./types";
import PaymentRequestForm from "./PaymentsRequest";

const StripeWrapper = styled.div`
  margin: 20px 0 0;
  max-width: 575px;
  width: 100%;

  label {
    display: block;
    margin-bottom: 5px;
    width: 100%;
  }
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
  right: ${(props: InputValidationStyleProps) => (props.inputState === INPUT_STATE.INVALID ? "30px" : "10px")};
  top: 8px;
  z-index: -1;
`;

export interface PaymentStripeFormProps extends ReactStripeElements.InjectedStripeProps {
  postId: string;
  newsroomName: string;
  shouldPublicize: boolean;
  userEmail?: string;
  usdToSpend: number;
  comment?: string;
  savePayment: MutationFunc;
  handlePaymentSuccess(paymentState: PAYMENT_STATE): void;
}

export interface PaymentStripeFormStates {
  email: string;
  emailState: string;
  name: string;
  nameState: string;
  country: string;
  countryState: string;
  postalCode: string;
  postalCodeState: string;
  cardNumberState: string;
  cardExpiryState: string;
  cardCVCState: string;
  isPaymentSuccess: boolean;
  isPaymentError: boolean;
  paymentProcessing: boolean;
}

class PaymentStripeForm extends React.Component<PaymentStripeFormProps, PaymentStripeFormStates> {
  public static contextType = CivilContext;
  public context!: ICivilContext;
  constructor(props: any) {
    super(props);
    this.state = {
      email: "",
      emailState: INPUT_STATE.EMPTY,
      name: "",
      nameState: INPUT_STATE.EMPTY,
      country: "",
      countryState: INPUT_STATE.EMPTY,
      postalCode: "",
      postalCodeState: INPUT_STATE.VALID,
      cardNumberState: INPUT_STATE.EMPTY,
      cardExpiryState: INPUT_STATE.EMPTY,
      cardCVCState: INPUT_STATE.EMPTY,
      isPaymentSuccess: false,
      isPaymentError: false,
      paymentProcessing: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public render(): JSX.Element {
    return (
      <form>
        <PaymentNotice>
          <PaymentStripeNoticeText />
        </PaymentNotice>
        <PaymentRequestForm
          savePayment={this.props.savePayment}
          boostId={this.props.postId}
          usdToSpend={this.props.usdToSpend}
          handlePaymentSuccess={this.props.handlePaymentSuccess}
        />
        <StripeWrapper>
          <PaymentInputLabel>Email</PaymentInputLabel>
          <InputValidationUI inputState={this.state.emailState}>
            {this.props.userEmail ? (
              <input
                id="email"
                name="email"
                value={this.props.userEmail}
                type="email"
                maxLength={254}
                onBlur={() => this.handleOnBlur(event)}
              />
            ) : (
              <input id="email" name="email" type="email" maxLength={254} onBlur={() => this.handleOnBlur(event)} />
            )}
          </InputValidationUI>
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
          <InputValidationUI inputState={this.state.countryState} className={"positionTop"}>
            <select id="country" name="country" onChange={() => this.handleOnBlur(event)}>
              <option value=""></option>
              {STRIPE_COUNTRIES.map((country: any, i: number) => {
                return (
                  <option key={i} value={country.value}>
                    {country.name}
                  </option>
                );
              })}
            </select>
            <DropDownWrap inputState={this.state.countryState}>
              <DropdownArrow />
            </DropDownWrap>
          </InputValidationUI>
          <InputValidationUI inputState={this.state.postalCodeState} className={"positionBottom"}>
            <input id="zip" name="zip" maxLength={12} placeholder="Zip code" onBlur={() => this.handleOnBlur(event)} />
          </InputValidationUI>
        </StripeWrapper>
        <PaymentBtn onClick={() => this.handleSubmit()} disabled={this.state.paymentProcessing}>
          {this.state.paymentProcessing ? "Payment processing..." : "Complete Boost"}
        </PaymentBtn>
        {this.state.isPaymentError && <PaymentErrorText />}
        <PaymentTerms>
          <PaymentStripeTermsText />
        </PaymentTerms>
      </form>
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
      case "country":
        const validCountry = value !== "";
        validCountry
          ? this.setState({ country: value, countryState: INPUT_STATE.VALID })
          : this.setState({ countryState: INPUT_STATE.INVALID });
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
      this.state.countryState === INPUT_STATE.VALID &&
      this.state.postalCodeState === INPUT_STATE.VALID &&
      this.state.cardNumberState === INPUT_STATE.VALID &&
      this.state.cardExpiryState === INPUT_STATE.VALID &&
      this.state.cardCVCState === INPUT_STATE.VALID
    ) {
      this.setState({ paymentProcessing: true, isPaymentSuccess: false, isPaymentError: false });
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
                comment: this.props.comment,
              },
            },
          });
          this.props.handlePaymentSuccess(PAYMENT_STATE.PAYMENT_SUCCESS);
        } catch (err) {
          console.error(err);
          this.setState({ isPaymentError: true });
        }
      }
    }
  }
}

export default injectStripe(PaymentStripeForm);
