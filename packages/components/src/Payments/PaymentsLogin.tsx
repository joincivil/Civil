import * as React from "react";
import { PAYMENT_STATE } from "./types";
import {
  PaymentLoginWrapper,
  PaymentLoginTitle,
  PaymentLoginOption,
  PaymentLoginType,
  PaymentLoginDescription,
  PaymentBtn,
  PaymentInvertedBtn,
} from "./PaymentsStyledComponents";

export interface PaymentsLoginProps {
  handleLogin(): void;
  handleNext(paymentState: PAYMENT_STATE): void;
}

export const PaymentsLogin: React.FunctionComponent<PaymentsLoginProps> = props => {
  return (
    <PaymentLoginWrapper>
      <PaymentLoginTitle>Welcome to Civil!</PaymentLoginTitle>
      <PaymentLoginOption>
        <PaymentLoginType>Log in to give a Boost 🚀</PaymentLoginType>
        <PaymentBtn onClick={props.handleLogin}>Log In / Sign Up</PaymentBtn>
        <PaymentLoginDescription>
          You’ll be able to keep track of your contributions and your username may be listed on the Boost leaderboard.
        </PaymentLoginDescription>
      </PaymentLoginOption>
      <PaymentLoginOption>
        <PaymentLoginType>Guest</PaymentLoginType>
        <PaymentLoginDescription>Proceed to Boost and become a Civil member later.</PaymentLoginDescription>
        <PaymentInvertedBtn onClick={() => props.handleNext(PAYMENT_STATE.SELECT_PAYMENT_TYPE)}>
          Continue as a Guest
        </PaymentInvertedBtn>
      </PaymentLoginOption>
    </PaymentLoginWrapper>
  );
};
