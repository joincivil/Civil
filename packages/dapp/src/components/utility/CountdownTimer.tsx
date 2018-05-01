import * as React from "react";
import { getReadableDuration } from "@joincivil/utils";

export interface CountdownTimerProps {
  endTime: number;
}

export interface CountdownTimerState {
  secondsRemaining: number;
  timer?: number;
}

class CountdownTimer extends React.Component<CountdownTimerProps, CountdownTimerState> {
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

  private renderApplicationPhase(): JSX.Element {
    return <>{this.getReadableTimeRemaining()}</>;
  }

  private getReadableTimeRemaining = (): string => {
    return getReadableDuration(this.state.secondsRemaining);
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

export default CountdownTimer;
