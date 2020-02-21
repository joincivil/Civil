import * as React from "react";
import styled from "styled-components";
import { colors } from "@joincivil/elements";

const SavedCardStyled = styled.div`
  align-items: flex-start;
  display: flex;
  > div {
    margin-right: 10px;
  }
  label {
    color: ${colors.accent.CIVIL_GRAY_3};
    font-size: 13px;
    line-height: 16px;
  }
`;

const SavedCardDetails = styled.div`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
`;

const SavedCardDate = styled.div`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-size: 13px;
  line-height: 16px;
`;

export interface PaymentStripeFormSavedCardProps {
  cardDetails: string;
  date: string;
}

export const PaymentStripeFormSavedCard: React.FunctionComponent<PaymentStripeFormSavedCardProps> = props => {
  return (
    <SavedCardStyled>
      <div>
        <SavedCardDetails>{props.cardDetails}</SavedCardDetails>
        <SavedCardDate>{props.date}</SavedCardDate>
      </div>
      <label>Saved card</label>
    </SavedCardStyled>
  );
};
