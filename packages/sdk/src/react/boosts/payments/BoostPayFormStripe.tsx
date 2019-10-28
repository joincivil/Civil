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
import {
  colors,
  fonts,
  mediaQueries,
  FullScreenModal,
  CivilContext,
  ICivilContext,
  DropdownArrow,
  CCAmexIcon,
  CCDiscoverIcon,
  CCMastercardIcon,
  CCVisaIcon,
  CCSecurityCodeIcon,
  FeatureFlag,
} from "@joincivil/components";
import { isValidEmail } from "@joincivil/utils";
import {
  BoostPayFormFlex,
  BoostPayFormWrapper,
  SubmitInstructions,
  SubmitWarning,
  BoostButton,
  BoostModalContain,
} from "../BoostStyledComponents";
import { PaymentSuccessCardModalText, PaymentErrorModalText } from "../BoostTextComponents";
import { BoostPayOption } from "./BoostPayOption";
import { Countries } from "./BoostPayCountriesList";
import { urlConstants } from "../../urlConstants";
import { InputValidationUI, InputValidationStyleProps, INPUT_STATE } from "./InputValidationUI";
import PaymentRequestForm from "./BoostPaymentRequest";

const StripeWrapper = styled.div`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 16px;
  line-height: 22px;
  margin: 20px 0 0;
  max-width: 575px;
  width: 100%;

  label {
    display: block;
    margin-bottom: 5px;
    width: 100%;
  }
`;

const StripeCardEmailWrap = styled.div`
  margin-bottom: 20px;

  input {
    width: 100%;
  }
`;

const StripeCardInfoWrap = styled.div`
  width: 100%;

  & > div {
    margin-bottom: 10px;
  }
`;

const StripeElement = styled.div`
  border: 1px solid
    ${(props: InputValidationStyleProps) =>
      props.inputState === INPUT_STATE.INVALID ? colors.accent.CIVIL_RED : colors.accent.CIVIL_GRAY_3};
  border-radius: 2px;
  padding: 12px;
`;

const StripeCardInfoFlex = styled.div`
  display: flex;

  & > div:first-of-type {
      margin-right: 10px;
    }
  }

  ${mediaQueries.MOBILE} {
    display: block;

    > div {
      &:first-of-type {
        margin: 0 0 10px;
      }
    }
  }
`;

const StripeUserInfoWrap = styled.div`
  margin-bottom: 10px;
  width: 100%;

  & > div {
    margin-bottom: 20px;

    ${mediaQueries.MOBILE} {
      width: 100%;
    }
  }
`;

const StripeUserInfoFlex = styled.div`
  display: flex;
  margin-bottom: 10px;

  & > div {
    &:first-of-type {
      margin-right: 10px;
    }

    &:last-of-type {
      width: 130px;

      input {
        width: 100%;
      }
    }
  }

  ${mediaQueries.MOBILE} {
    display: block;

    div {
      &:first-of-type {
        margin: 0 0 10px;
      }
    }
  }
`;

const StripePolicy = styled.div`
  a {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-size: 14px;
    line-height: 19px;

    &:hover {
      text-decoration: underline;
    }

    &:first-of-type {
      margin-right: 15px;
    }
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

export interface BoostPayFormStripeProps extends ReactStripeElements.InjectedStripeProps {
  boostId: string;
  newsroomName: string;
  title: string;
  usdToSpend: number;
  selected: boolean;
  paymentType: string;
  optionLabel: string | JSX.Element;
  savePayment: MutationFunc;
  handlePaymentSuccess(): void;
}

export interface BoostPayFormStripeStates {
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
  isSuccessModalOpen: boolean;
  isErrorModalOpen: boolean;
  paymentProcessing: boolean;
}

class BoostPayFormStripe extends React.Component<BoostPayFormStripeProps, BoostPayFormStripeStates> {
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
      isSuccessModalOpen: false,
      isErrorModalOpen: false,
      paymentProcessing: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public render(): JSX.Element {
    let postalCodeVisible = false;
    // Stripe recommends getting the zip/postal codes for the US, UK, and Canada
    if (this.state.country === "USA" || this.state.country === "CAN" || this.state.country === "GBR") {
      postalCodeVisible = true;
    }

    return (
      <form>
        <BoostPayOption
          paymentType={this.props.paymentType}
          optionLabel={this.props.optionLabel}
          selected={this.props.selected}
        >
          <FeatureFlag feature={"pay-request"}>
            <PaymentRequestForm
              savePayment={this.props.savePayment}
              boostId={this.props.boostId}
              usdToSpend={this.props.usdToSpend}
              onPayRequestSuccess={this.handlePayRequestSuccess}
              onPayRequestError={this.handlePayRequestError}
            />
          </FeatureFlag>
          <StripeWrapper>
            <StripeCardEmailWrap>
              <label>Email</label>
              <InputValidationUI inputState={this.state.emailState}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  maxLength={254}
                  onBlur={() => this.handleOnBlur(event)}
                  required
                />
              </InputValidationUI>
            </StripeCardEmailWrap>
            <StripeCardInfoWrap>
              <label>Card information</label>
              <InputValidationUI inputState={this.state.cardNumberState} width={"500px"}>
                <StripeElement inputState={this.state.cardNumberState}>
                  <CardNumberElement id="card-number" onBlur={() => this.handleOnBlurStripe()} />
                </StripeElement>
                <CreditCardIconsWrap inputState={this.state.cardNumberState}>
                  <CCAmexIcon />
                  <CCDiscoverIcon />
                  <CCMastercardIcon />
                  <CCVisaIcon />
                </CreditCardIconsWrap>
              </InputValidationUI>
              <StripeCardInfoFlex>
                <InputValidationUI inputState={this.state.cardExpiryState} width={"170px"}>
                  <StripeElement inputState={this.state.cardExpiryState}>
                    <CardExpiryElement id="card-expiry" onBlur={() => this.handleOnBlurStripe()} />
                  </StripeElement>
                </InputValidationUI>
                <InputValidationUI inputState={this.state.cardCVCState} width={"130px"}>
                  <StripeElement inputState={this.state.cardCVCState}>
                    <CardCvcElement id="card-cvc" onBlur={() => this.handleOnBlurStripe()} />
                  </StripeElement>
                  <CreditCardCVCWrap inputState={this.state.cardCVCState}>
                    <CCSecurityCodeIcon />
                  </CreditCardCVCWrap>
                </InputValidationUI>
              </StripeCardInfoFlex>
            </StripeCardInfoWrap>
            <StripeUserInfoWrap>
              <label>Name on card</label>
              <InputValidationUI inputState={this.state.nameState} width={"300px"}>
                <input id="name" name="name" onBlur={() => this.handleOnBlur(event)} required />
              </InputValidationUI>
              <StripeUserInfoFlex>
                <div>
                  <label>Country or region</label>
                  <InputValidationUI inputState={this.state.countryState} width={"300px"}>
                    <select id="country" name="country" onChange={() => this.handleOnBlur(event)}>
                      <option value=""></option>
                      {Countries.map((country: any, i: number) => {
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
                </div>
                <div>
                  {postalCodeVisible &&
                    (this.state.country === "USA" ? (
                      <>
                        <label>Zip Code</label>
                        <InputValidationUI inputState={this.state.postalCodeState} width={"150px"}>
                          <input
                            type="number"
                            id="zip"
                            name="zip"
                            maxLength={12}
                            onBlur={() => this.handleOnBlur(event)}
                          />
                        </InputValidationUI>
                      </>
                    ) : (
                      <>
                        <label>Postal Code</label>
                        <InputValidationUI inputState={this.state.postalCodeState} width={"150px"}>
                          <input id="zip" name="zip" maxLength={12} onBlur={() => this.handleOnBlur(event)} />
                        </InputValidationUI>
                      </>
                    ))}
                </div>
              </StripeUserInfoFlex>
            </StripeUserInfoWrap>
            <StripePolicy>
              <a href="https://stripe.com/" target="_blank">
                Powered by Stripe
              </a>
              <a href="https://stripe.com/privacy" target="_blank">
                Privacy and Terms
              </a>
            </StripePolicy>
          </StripeWrapper>
        </BoostPayOption>

        <BoostPayFormWrapper>
          <BoostPayFormFlex>
            <SubmitInstructions>
              All proceeds of the Boost go directly to the newsroom minus Stripe processing fees. If a Boost goal is not
              met, the proceeds will still go to fund the selected newsroom.
            </SubmitInstructions>
            <div>
              <BoostButton onClick={() => this.handleSubmit()} disabled={this.state.paymentProcessing}>
                {this.state.paymentProcessing ? "Payment processing..." : "Support this Boost"}
              </BoostButton>
              <SubmitWarning>
                Refunds are not possible. Civil does not charge any fees for this transaction. There are small fees
                charged by Stripe. By sending a Boost, you agree to Civil’s{" "}
                <a href={urlConstants.TERMS}>Terms of Use</a> and{" "}
                <a href={urlConstants.PRIVACY_POLICY}>Privacy Policy</a>. Depending on your selection, your email and
                comment may be visible to the newsroom.
              </SubmitWarning>
            </div>
          </BoostPayFormFlex>
        </BoostPayFormWrapper>
        <FullScreenModal open={this.state.isErrorModalOpen}>
          <BoostModalContain textAlign={"center"}>
            <PaymentErrorModalText hideModal={this.hideModal} />
          </BoostModalContain>
        </FullScreenModal>
        <FullScreenModal open={this.state.isSuccessModalOpen}>
          <BoostModalContain textAlign={"center"}>
            <PaymentSuccessCardModalText
              newsroomName={this.props.newsroomName}
              usdToSpend={this.props.usdToSpend}
              handlePaymentSuccess={this.props.handlePaymentSuccess}
              boostId={this.props.boostId}
              newsroom={this.props.newsroomName}
              title={this.props.title}
            />
          </BoostModalContain>
        </FullScreenModal>
      </form>
    );
  }

  private handlePayRequestSuccess = () => {
    this.setState({isSuccessModalOpen: true});
  }

  private handlePayRequestError = () => {
    this.setState({ isErrorModalOpen: true });
  }

  private hideModal = () => {
    this.setState({ isErrorModalOpen: false, paymentProcessing: false });
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
      this.setState({ paymentProcessing: true });
      if (this.props.stripe) {
        try {
          this.context.fireAnalyticsEvent(
            "boosts",
            "start submit CC support",
            this.props.boostId,
            this.props.usdToSpend,
          );
          const token = await this.props.stripe.createToken({
            name: this.state.name,
            address_country: this.state.country,
            address_zip: this.state.postalCode,
          });
          await this.props.savePayment({
            variables: {
              postID: this.props.boostId,
              input: {
                // @ts-ignore
                paymentToken: token.token.id,
                amount: this.props.usdToSpend,
                currencyCode: "usd",
                emailAddress: this.state.email,
              },
            },
          });
          this.setState({ isSuccessModalOpen: true });
        } catch (err) {
          console.error(err);
          this.setState({ isErrorModalOpen: true });
        }
      }
    }
  }
}

export default injectStripe(BoostPayFormStripe);
