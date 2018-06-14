import * as React from "react";
import { getLocalDateTimeStrings, getReadableDuration } from "@joincivil/utils";
import { colors, fonts } from "../styleConstants";
import styled, { StyledComponentClass } from "styled-components";
import { CountdownTimerProps, InjectedCountdownTimerProps, CountdownTimerState } from "./types";

const ProgressBarCountdownContainer = styled.div`
  margin: 0 0 24px;
`;
const ProgressBarDisplayLabel = styled.h4`
  font-size: 16px;
  font-weight: normal;
  line-height: 19px;
  margin: 0 0 7px;
`;
const ProgressBarBase = styled.div`
  height: 12px;
  border-radius: 7.5px;
`;
const ProgressBarCountdownTotal = ProgressBarBase.extend`
  background-color: ${colors.accent.CIVIL_GRAY_4};
  box-sizing: border-box;
  position: relative;
  width: 100%;
`;
const ProgressBarCountdownProgress = ProgressBarBase.extend`
  display: inline-block;
  background-color: ${colors.accent.CIVIL_BLUE};
  left: 0;
  top: 0;
  position: absolute;
  transition: width 500ms ease;
`;
const StyledProgressBarCountdownTimer = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  text-align: left;
`;
const MetaItem = styled.div`
  margin: 0 0 16px;
`;
const MetaItemValue = styled.div`
  font-size: 24px;
  line-height: 29px;
`;
const MetaItemValueAccent = MetaItemValue.extend`
  color: ${colors.primary.CIVIL_BLUE_1};
`;
const MetaItemLabel = styled.div`
  font-size: 14px;
  line-height: 17px;
`;
const ProgressBarCopy = styled.div`
  font-size: 16px;
  line-height: 26px;
`;
const StyledCountdownLabel = styled.span`
  color: ${colors.primary.BLACK};
`;
const StyledCountdownLabelWarn = StyledCountdownLabel.extend`
  color: ${colors.accent.CIVIL_RED};
`;
const StyledExpiry = styled.div`
  font-size: 14px;
  line-height: 17px;
  margin: 2px 0 0;
`;

export interface ProgressBarCountdownProps {
  displayLabel: string;
  flavorText: string;
  totalSeconds: number;
}

export class ProgressBarCountdownTimerComponent extends React.Component<
  CountdownTimerProps & InjectedCountdownTimerProps & ProgressBarCountdownProps
> {
  public render(): JSX.Element {
    const progress = this.getProgress();
    const style = { width: `${(progress * 100).toString()}%` };
    return (
      <StyledProgressBarCountdownTimer>
        <ProgressBarCountdownContainer>
          <ProgressBarDisplayLabel>{this.props.displayLabel}</ProgressBarDisplayLabel>
          <ProgressBarCountdownTotal>
            <ProgressBarCountdownProgress style={style} />
          </ProgressBarCountdownTotal>
        </ProgressBarCountdownContainer>
        {this.renderReadableTimeRemaining()}
        {this.renderExpiry()}
      </StyledProgressBarCountdownTimer>
    );
  }

  private renderExpiry = (): JSX.Element => {
    const [expiryDateString, expiryTimeString] = getLocalDateTimeStrings(this.props.endTime);
    return (
      <ProgressBarCopy>
        Newsroom listing {this.props.secondsRemaining! > 0 ? "is" : "was"} {this.props.flavorText} until{" "}
        {expiryDateString} {expiryTimeString}
      </ProgressBarCopy>
    );
  };

  private renderReadableTimeRemaining = (): JSX.Element => {
    if (this.props.secondsRemaining! > 0) {
      return (
        <MetaItem>
          <MetaItemValueAccent>{getReadableDuration(this.props.secondsRemaining!)}</MetaItemValueAccent>
          <MetaItemLabel>Remaining</MetaItemLabel>
        </MetaItem>
      );
    }
    return (
      <MetaItem>
        <MetaItemValueAccent>Ended</MetaItemValueAccent>
        <MetaItemLabel>&nbsp;</MetaItemLabel>
      </MetaItem>
    );
  };

  private getProgress = (): number => {
    if (this.props.secondsRemaining! > 0) {
      return 1 - this.props.secondsRemaining! / this.props.totalSeconds;
    }
    return 1;
  };
}
