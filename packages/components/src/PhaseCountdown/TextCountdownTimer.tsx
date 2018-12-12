import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { getLocalDateTimeStrings, getReadableDuration } from "@joincivil/utils";
import { colors, fonts } from "../styleConstants";
import { ClockIcon } from "../icons";
import { CountdownTimerProps, InjectedCountdownTimerProps } from "./types";

const StyledCountdownTimerContainer = styled.div`
  display: flex;
  font: normal 14px/17px ${fonts.SANS_SERIF};
  margin: 0 0 16px;
`;

export const StyledDurationContainer = styled.span`
  color: ${colors.accent.CIVIL_BLUE};
`;
const StyledIconContainer = styled.span`
  margin-right: 12px;
`;
export const StyledCountdownLabel = styled.span`
  color: ${colors.accent.CIVIL_BLUE};
`;
export const StyledCountdownLabelWarn = styled(StyledCountdownLabel)`
  color: ${colors.accent.CIVIL_RED};
`;
const StyledExpiry = styled.div`
  font-size: 14px;
  line-height: 17px;
  margin: 2px 0 0;
`;

export class TextCountdownTimerComponent extends React.Component<CountdownTimerProps & InjectedCountdownTimerProps> {
  public render(): JSX.Element {
    const labelText = this.props.secondsRemaining! > 0 ? "Ends in " : "Ended";
    let label;
    if (this.props.warn) {
      label = <StyledCountdownLabelWarn>{labelText}</StyledCountdownLabelWarn>;
    } else {
      label = <StyledCountdownLabel>{labelText}</StyledCountdownLabel>;
    }
    return (
      <StyledCountdownTimerContainer>
        <StyledIconContainer>
          <ClockIcon />
        </StyledIconContainer>
        <div>
          <StyledDurationContainer>
            {label} {this.renderReadableTimeRemaining()}
          </StyledDurationContainer>
          {this.renderExpiry()}
        </div>
      </StyledCountdownTimerContainer>
    );
  }

  private renderExpiry = (): JSX.Element => {
    const [expiryDateString, expiryTimeString] = getLocalDateTimeStrings(this.props.endTime);
    return (
      <StyledExpiry>
        {expiryDateString} at {expiryTimeString}
      </StyledExpiry>
    );
  };

  private renderReadableTimeRemaining = (): JSX.Element => {
    if (this.props.warn) {
      return (
        <StyledCountdownLabelWarn>
          <b>{getReadableDuration(this.props.secondsRemaining!, ["second"])}</b>
        </StyledCountdownLabelWarn>
      );
    }
    return <b>{getReadableDuration(this.props.secondsRemaining!, ["second"])}</b>;
  };
}
