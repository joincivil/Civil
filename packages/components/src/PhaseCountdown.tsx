import * as React from "react";
import { getReadableDuration } from "@joincivil/utils";
import { colors, fonts } from "./styleConstants";
import styled, { StyledComponentClass } from "styled-components";

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

export interface CountdownTimerProps {
  warn?: boolean | undefined;
  endTime: number;
}

export interface CountdownTimerState {
  secondsRemaining: number;
  timer?: number;
}

export class CountdownTimer extends React.Component<CountdownTimerProps, CountdownTimerState> {
  constructor(props: CountdownTimerProps) {
    super(props);
    this.state = {
      secondsRemaining: 0,
    };
  }

  public async componentDidMount(): Promise<void> {
    return this.initCountdown();
  }

  public render(): JSX.Element {
    return this.renderApplicationPhase();
  }

  public componentWillUnmount(): void {
    if (this.state.timer) {
      window.clearInterval(this.state.timer);
    }
  }

  private renderApplicationPhase(): JSX.Element {
    const labelText = this.state.secondsRemaining > 0 ? "Ends in " : "Ended";
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
    const expiryDateTime = new Date(this.props.endTime * 1000);
    const timeString = `${pad(expiryDateTime.getHours(), 2)}:${pad(expiryDateTime.getMinutes(), 2)} GMT-${pad(
      expiryDateTime.getTimezoneOffset() / 60,
      2,
    )}${pad(expiryDateTime.getTimezoneOffset() % 60, 2)}`;
    // const timeString = expiryDateTime.toTimeString();
    const expiryText = `${expiryDateTime.getFullYear()}-${expiryDateTime.getMonth() + 1}-${expiryDateTime.getDate()} `;
    return (
      <StyledExpiry>
        <b>{expiryText}</b>
        {timeString}
      </StyledExpiry>
    );
  };

  private renderReadableTimeRemaining = (): JSX.Element => {
    if (this.props.warn) {
      return (
        <StyledCountdownLabelWarn>
          <b>{getReadableDuration(this.state.secondsRemaining)}</b>
        </StyledCountdownLabelWarn>
      );
    }
    return <b>{getReadableDuration(this.state.secondsRemaining)}</b>;
  };

  // TODO(nickreynolds): move this all into redux
  private initCountdown = async () => {
    const timeRemaining = this.updateTimeRemaining();
    if (timeRemaining > 0) {
      this.setState({ timer: window.setInterval(this.updateTimeRemaining, 1000) });
    } else {
      window.clearInterval(this.state.timer);
    }
  };

  private updateTimeRemaining = () => {
    const expiry = this.props.endTime;
    const currentTime = parseInt((Date.now() / 1000).toString(), 10); // convert from milliseconds
    const secondsRemaining = expiry - currentTime;
    this.setState({ secondsRemaining });
    return secondsRemaining;
  };
}

function pad(num: number | string, places: number, append: boolean = false): string {
  let out = typeof num === "number" ? num.toString() : num;
  while (out.length < places) {
    if (append) {
      out += "0";
    } else {
      out = "0" + out;
    }
  }
  return out;
}
