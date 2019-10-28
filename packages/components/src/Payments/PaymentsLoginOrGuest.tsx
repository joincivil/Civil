import * as React from "react";
import { PAYMENT_STATE } from "./types";
import {
  PaymentLoginOrGuestWrapper,
  PaymentLoginOrGuestTitle,
  PaymentLoginOrGuestOption,
  PaymentLoginOrGuestType,
  PaymentLoginOrGuestDescription,
  PaymentBtn,
  PaymentInvertedBtn,
} from "./PaymentsStyledComponents";

export interface PaymentsLoginProps {
  handleLogin(): void;
  handleNext(paymentState: PAYMENT_STATE): void;
}

export const PaymentsLoginOrGuest: React.FunctionComponent<PaymentsLoginProps> = props => {
  return (
    <PaymentLoginOrGuestWrapper>
      <PaymentLoginOrGuestTitle>Welcome to Civil!</PaymentLoginOrGuestTitle>
      <PaymentLoginOrGuestOption>
        <PaymentLoginOrGuestType>Log in to give a Boost 🚀</PaymentLoginOrGuestType>
        <PaymentBtn onClick={props.handleLogin}>Log In / Sign Up</PaymentBtn>
        <PaymentLoginOrGuestDescription>
          You’ll be able to keep track of your contributions and your username may be listed on the Boost leaderboard.
        </PaymentLoginOrGuestDescription>
      </PaymentLoginOrGuestOption>
      <PaymentLoginOrGuestOption>
        <PaymentLoginOrGuestType>Guest</PaymentLoginOrGuestType>
        <PaymentLoginOrGuestDescription>
          Proceed to Boost and become a Civil member later.
        </PaymentLoginOrGuestDescription>
        <PaymentInvertedBtn onClick={() => props.handleNext(PAYMENT_STATE.SELECT_PAYMENT_TYPE)}>
          Continue as a Guest
        </PaymentInvertedBtn>
      </PaymentLoginOrGuestOption>
    </PaymentLoginOrGuestWrapper>
  );
};
