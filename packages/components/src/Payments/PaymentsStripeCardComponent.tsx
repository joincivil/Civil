import * as React from "react";
import styled from "styled-components";
import { PaymentInputLabel } from "./PaymentsStyledComponents";
import { InputValidationUI, InputStripeValidationUI, StripeElement, InputErrorMessage } from "./PaymentsInputValidationUI";
import { PaymentEmailPrepopulatedText, PaymentEmailConfirmationText } from "./PaymentsTextComponents";
import { CardElement } from "react-stripe-elements";

const StripeWrapper = styled.div`
  margin: 20px 0 0;
  max-width: 500px;
  width: 100%;
`;

interface PaymentsStripeCardComponentProps {
  email: string;
  wasEmailPrepopulated: boolean;
  emailState: string;
  nameState: string;
  cardInfoState: string;
  displayStripeErrorMessage: string;
  handleOnBlur(event: any): void;
  handleStripeChange(event: any): void;
}

export const PaymentsStripeCardComponent: React.FunctionComponent<PaymentsStripeCardComponentProps> = props => {
  const { email, wasEmailPrepopulated, emailState, nameState, cardInfoState, displayStripeErrorMessage, handleOnBlur, handleStripeChange } = props;
  return (
    <StripeWrapper>
      {wasEmailPrepopulated && <PaymentEmailPrepopulatedText email={email} />}
      {!wasEmailPrepopulated && (
        <>
          <PaymentInputLabel>Email</PaymentInputLabel>
          <InputValidationUI inputState={emailState}>
            <input
              defaultValue={email}
              id="email"
              name="email"
              type="email"
              maxLength={254}
              onBlur={() => handleOnBlur(event)}
            />
            <PaymentEmailConfirmationText />
          </InputValidationUI>
        </>
      )}
      <PaymentInputLabel>Name on card</PaymentInputLabel>
      <InputValidationUI inputState={nameState}>
        <input id="name" name="name" onBlur={() => handleOnBlur(event)} required />
      </InputValidationUI>
      <PaymentInputLabel>Card information</PaymentInputLabel>
      <InputStripeValidationUI inputState={cardInfoState}>
        <StripeElement inputState={cardInfoState}>
          <CardElement
            id="card-info"
            style={{ base: { fontSize: "13px" } }}
            onChange={handleStripeChange}
          />
        </StripeElement>
        {displayStripeErrorMessage !== "" && (
          <InputErrorMessage>{displayStripeErrorMessage}</InputErrorMessage>
        )}
      </InputStripeValidationUI>
    </StripeWrapper>
  );
}
