import * as React from "react";
import { PaymentBtn } from "./PaymentsStyledComponents";
import { PaymentSuccessText } from "./PaymentsTextComponents";
import { HollowGreenCheck, fonts, colors } from "@joincivil/elements";
import styled from "styled-components";

const PaymentsSuccessStyled = styled.div`
  font-family: ${fonts.SANS_SERIF};
  text-align: center;

  svg {
    margin-bottom: 10px;
  }

  h2 {
    font-size: 18px;
    font-weight: 600;
    line-height: 22px;
    margin: 0 0 5px;
  }

  p {
    color: ${colors.accent.CIVIL_GRAY_1};
    font-size: 14px;
    line-height: 17px;
    margin: 0 0 15px;
  }
`;

const PaymentSuccessTextStyled = styled.div`
  margin: 0 auto 30px;
  width: 280px;
`;

export interface PaymentsSuccessProps {
  newsroomName: string;
  usdToSpend: number;
  handleClose(): void;
}

export const PaymentsSuccess: React.FunctionComponent<PaymentsSuccessProps> = props => {
  return (
    <PaymentsSuccessStyled>
      <HollowGreenCheck width={48} height={48} />
      <PaymentSuccessTextStyled>
        <PaymentSuccessText newsroomName={props.newsroomName} usdToSpend={props.usdToSpend} />
      </PaymentSuccessTextStyled>
      <PaymentBtn onClick={props.handleClose}>Done</PaymentBtn>
    </PaymentsSuccessStyled>
  );
};
