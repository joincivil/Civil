import * as React from "react";
import { InjectedCountdownTimerProps, ProgressBarCountdownProps } from "./types";
import {
  StyledProgressBarCountdownTimer,
  ProgressBarCountdownContainer,
  ProgressBarDisplayLabel,
  ProgressBarCountdownTotal,
  ProgressBarCountdownProgress,
} from "./styledComponents";

export class SmallProgressBarCountdownTimerComponent extends React.Component<
  ProgressBarCountdownProps & InjectedCountdownTimerProps
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
      </StyledProgressBarCountdownTimer>
    );
  }

  private getProgress = (): number => {
    if (this.props.secondsRemaining! > 0) {
      return 1 - this.props.secondsRemaining! / this.props.totalSeconds;
    }
    return 1;
  };
}
