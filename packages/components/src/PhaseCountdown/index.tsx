import {
  CountdownTimerProps,
  InjectedCountdownTimerProps,
  CountdownTimerState,
  ProgressBarCountdownProps,
  TwoPhaseProgressBarCountdownProps,
} from "./types";
import { TextCountdownTimerComponent } from "./TextCountdownTimer";
import { ProgressBarCountdownTimerComponent } from "./ProgressBarCountdownTimer";
import { TwoPhaseProgressBarCountdownTimerComponent } from "./TwoPhaseProgressBarCountdownTimer";
import { SmallProgressBarCountdownTimerComponent } from "./SmallProgressBarCountdownTimer";
import * as React from "react";

const connectCountdownTimer = () => <TCountdownTimerProps extends CountdownTimerProps>(
  CountdownTimerComponent:
    | React.ComponentClass<TCountdownTimerProps & InjectedCountdownTimerProps>
    | React.StatelessComponent<TCountdownTimerProps & InjectedCountdownTimerProps>,
) => {
  return class HOCountdownTimerContainer extends React.Component<TCountdownTimerProps, CountdownTimerState> {
    public timer?: number;

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
      if (this.timer) {
        window.clearInterval(this.timer);
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
        this.timer = window.setInterval(this.updateTimeRemaining, 1000);
      } else {
        window.clearInterval(this.timer);
      }
    };
  };
};

export const TextCountdownTimer = connectCountdownTimer()(TextCountdownTimerComponent);

export const ProgressBarCountdownTimer: React.ComponentClass<ProgressBarCountdownProps> = connectCountdownTimer()(
  ProgressBarCountdownTimerComponent,
);

export const SmallProgressBarCountdownTimer: React.ComponentClass<ProgressBarCountdownProps> = connectCountdownTimer()(
  SmallProgressBarCountdownTimerComponent,
);

export const TwoPhaseProgressBarCountdownTimer: React.ComponentClass<
  TwoPhaseProgressBarCountdownProps
> = connectCountdownTimer()(TwoPhaseProgressBarCountdownTimerComponent);

export * from "./types";
export * from "./constants";
