import * as React from "react";

export interface CountdownTimerProps {
  endTime: number;
}

export interface CountdownTimerState {
  secondsRemaining: number;
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
    return <>{this.state.secondsRemaining} seconds</>;
  }

  // TODO(nickreynolds): move this all into redux
  private initCountdown = async () => {
    this.updateTimeRemaining();
    setInterval(this.updateTimeRemaining, 1000);
  };

  private updateTimeRemaining = () => {
    const expiry = this.props.endTime;
    const currentTime = parseInt((Date.now() / 1000).toString(), 10); // convert from milliseconds
    const secondsRemaining = expiry - currentTime;
    this.setState({ secondsRemaining });
  };
}

export default CountdownTimer;
