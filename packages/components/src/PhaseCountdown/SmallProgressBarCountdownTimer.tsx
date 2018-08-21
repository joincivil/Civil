import * as React from "react";
import { InjectedCountdownTimerProps, ProgressBarCountdownProps } from "./types";
import { getReadableDuration } from "@joincivil/utils";
import {
  StyledProgressBarCountdownTimer,
  ProgressBarCountdownContainer,
  ProgressBarCountdownTotal,
  ProgressBarCountdownProgress,
  MetaItem,
  CompactProgressBarDisplayLabel,
  CompactMetaItemValueAccent,
} from "./styledComponents";

export class SmallProgressBarCountdownTimerComponent extends React.Component<
  ProgressBarCountdownProps & InjectedCountdownTimerProps
> {
  public render(): JSX.Element {
    const progress = this.getProgress();
    const style = { width: `${(progress * 100).toString()}%` };
    const DisplayLabel = this.props.displayLabel;
    return (
      <StyledProgressBarCountdownTimer>
        <ProgressBarCountdownContainer>
          <CompactProgressBarDisplayLabel><DisplayLabel /></CompactProgressBarDisplayLabel>
          {this.renderReadableTimeRemaining()}
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

  private renderReadableTimeRemaining = (): JSX.Element => {
    const FlavorText = this.props.flavorText || (() => <></>);
    if (this.props.secondsRemaining! > 0) {
      return (
        <MetaItem>
          <CompactMetaItemValueAccent>{getReadableDuration(this.props.secondsRemaining!)} <FlavorText /></CompactMetaItemValueAccent>
        </MetaItem>
      );
    }
    return (
      <MetaItem>
        <CompactMetaItemValueAccent>Ended</CompactMetaItemValueAccent>
      </MetaItem>
    );
  };
}
