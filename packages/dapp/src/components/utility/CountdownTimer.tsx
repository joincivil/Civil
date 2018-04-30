import * as React from "react";

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
    const out = [];
    let period: [number, string];
    const periods: Array<[number, string]> = [[86400, "day"], [3600, "hour"], [60, "minute"], [1, "second"]];
    let secs: number = this.state.secondsRemaining;

    while (periods.length) {
      period = periods.shift()!;
      const periodUnits = Math.floor(secs / period[0]);
      if (periodUnits > 0) {
        out.push(periodUnits.toString(), period[1] + (periodUnits !== 1 ? "s" : ""));
        secs = secs % period[0];
      }
    }

    return out.join(" ");
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
