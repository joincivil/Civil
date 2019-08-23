import * as React from "react";
import styled from "styled-components";
import { colors, mediaQueries } from "@joincivil/components";

export interface BoostProgressWidthProps {
  paymentsTotal: number;
  goalAmount: number;
}

export interface BoostProgressProps {
  open: boolean;
  paymentsTotal: number;
  goalAmount: number;
  timeRemaining: string;
}

const BoostProgressWrapper = styled.div`
  margin-bottom: 20px;
  width: 100%;

  ${mediaQueries.MOBILE} {
    border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
    padding-top: 20px;
  }
`;

const BoostProgressBar = styled.div`
  background-color: ${colors.accent.CIVIL_GRAY_4};
  border-radius: 5px;
  height: 10px;
  margin: 8px 0;
  overflow: hidden;
  width: 100%;

  ${mediaQueries.MOBILE} {
    border-radius: 4px;
    height: 8px;
  }
`;

const BoostProgressPercent = styled.div`
  background-color: ${colors.accent.CIVIL_TEAL};
  border-radius: 5px;
  height: 10px;
  width: ${(props: BoostProgressWidthProps) => ((props.paymentsTotal / props.goalAmount) * 100).toString()}%;

  ${mediaQueries.MOBILE} {
    border-radius: 4px;
    height: 8px;
  }
`;

const BoostProgressFlex = styled.div`
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
`;

const AlignRight = styled.div`
  text-align: right;
`;

const TextSecondary = styled.span`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-size: 14px;
  font-weight: 600;
  line-height: 14px;

  ${mediaQueries.MOBILE} {
    font-size: 12px;
    line-height: 12px;
  }
`;

const TextPrimary = styled.span`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-size: 18px;
  font-weight: 500;
  line-height: 18px;

  ${mediaQueries.MOBILE} {
    font-size: 15px;
    line-height: 15px;
  }
`;

export const BoostProgress: React.FunctionComponent<BoostProgressProps> = props => {
  const percentRaised = Math.round((props.paymentsTotal / props.goalAmount) * 100);

  return (
    <BoostProgressWrapper>
      <BoostProgressFlex>
        <TextPrimary>{"$" + props.paymentsTotal.toFixed(2)} raised</TextPrimary>
        <AlignRight>
          <TextPrimary>
            <b>${props.goalAmount}</b> goal
          </TextPrimary>
        </AlignRight>
      </BoostProgressFlex>
      <BoostProgressBar>
        <BoostProgressPercent paymentsTotal={props.paymentsTotal} goalAmount={props.goalAmount} />
      </BoostProgressBar>
      <BoostProgressFlex>
        <TextSecondary>{percentRaised}%</TextSecondary>
        <AlignRight>
          <TextSecondary>{props.timeRemaining}</TextSecondary>
        </AlignRight>
      </BoostProgressFlex>
    </BoostProgressWrapper>
  );
};
