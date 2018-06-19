import { CountdownTimerProps, InjectedCountdownTimerProps, CountdownTimerState } from "./types";
import { TextCountdownTimerComponent } from "./TextCountdownTimer";
import { ProgressBarCountdownTimerComponent, ProgressBarCountdownProps } from "./ProgressBarCountdownTimer";
import * as React from "react";

const connectCountdownTimer = () => <TCountdownTimerProps extends CountdownTimerProps>(
  CountdownTimerComponent:
    | React.ComponentClass<TCountdownTimerProps & InjectedCountdownTimerProps>
    | React.StatelessComponent<TCountdownTimerProps & InjectedCountdownTimerProps>,
) => {
  return class HOCountdownTimerContainer extends React.Component<TCountdownTimerProps, CountdownTimerState> {
    public _timer: number | undefined;

    constructor(props: TCountdownTimerProps) {
      super(props);
      this.state = {
        secondsRemaining: 0,
      };
    }

    public render(): JSX.Element {
      return <CountdownTimerComponent {...this.props} {...this.state} />;
    }

    public async componentDidMount(): Promise<void> {
      return this.initCountdown();
    }

    public componentWillUnmount(): void {
      if (this._timer) {
        window.clearInterval(this._timer);
      }
    }

    public updateTimeRemaining = () => {
      const expiry = this.props.endTime;
      const currentTime = parseInt((Date.now() / 1000).toString(), 10); // convert from milliseconds
      const secondsRemaining = expiry - currentTime;
      this.setState({ secondsRemaining });
      return secondsRemaining;
    };

    public initCountdown = async () => {
      const timeRemaining = this.updateTimeRemaining();
      if (timeRemaining > 0) {
        this._timer = window.setInterval(this.updateTimeRemaining, 1000);
      } else {
        window.clearInterval(this._timer);
      }
    };
  };
};

export const TextCountdownTimer = connectCountdownTimer()(TextCountdownTimerComponent);
export const ProgressBarCountdownTimer = connectCountdownTimer()(ProgressBarCountdownTimerComponent);
