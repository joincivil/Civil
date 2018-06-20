import * as React from "react";
import { getLocalDateTimeStrings, getReadableDuration } from "@joincivil/utils";
import { colors, fonts } from "../styleConstants";
import styled, { StyledComponentClass } from "styled-components";
import { CountdownTimerProps, InjectedCountdownTimerProps } from "./types";

const StyledCountdownTimerContainer = styled.div`
  font: normal 16px/19px ${fonts.SANS_SERIF};
  margin: 0 0 16px;
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
        {label}
        {this.renderReadableTimeRemaining()}
        {this.renderExpiry()}
      </StyledCountdownTimerContainer>
    );
  }

  private renderExpiry = (): JSX.Element => {
    const [expiryDateString, expiryTimeString] = getLocalDateTimeStrings(this.props.endTime);
    return (
      <StyledExpiry>
        <b>{expiryDateString}</b>&nbsp;{expiryTimeString}
      </StyledExpiry>
    );
  };

  private renderReadableTimeRemaining = (): JSX.Element => {
    if (this.props.warn) {
      return (
        <StyledCountdownLabelWarn>
          <b>{getReadableDuration(this.props.secondsRemaining!)}</b>
        </StyledCountdownLabelWarn>
      );
    }
    return <b>{getReadableDuration(this.props.secondsRemaining!)}</b>;
  };
}
