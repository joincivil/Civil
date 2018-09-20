import * as React from "react";
import { getLocalDateTimeStrings, getReadableDuration } from "@joincivil/utils";
import { InjectedCountdownTimerProps, TwoPhaseProgressBarCountdownProps } from "./types";
import {
  StyledProgressBarCountdownTimer,
  ProgressBarCountdownContainer,
  ProgressBarDisplayLabel,
  ProgressBarCountdownTotal,
  ProgressBarCountdownProgress,
  ProgressBarCopy,
  TwoPhaseProgressBarContainer,
  MetaItem,
  MetaItemValueAccent,
  MetaItemLabel,
} from "./styledComponents";

export class TwoPhaseProgressBarCountdownTimerComponent extends React.Component<
  TwoPhaseProgressBarCountdownProps & InjectedCountdownTimerProps
> {
  public render(): JSX.Element {
    return (
      <StyledProgressBarCountdownTimer>
        {this.renderCountdownProgressBars()}
        {this.renderReadableTimeRemaining()}
        {this.renderExpiry()}
      </StyledProgressBarCountdownTimer>
    );
  }

  private renderCountdownProgressBars = (): JSX.Element => {
    const primaryProgressBar = this.renderPrimaryProgressBar();
    const secondaryProgressBar = this.renderSecondaryProgressBar();
    let progressBars: JSX.Element[];

    if (this.props.activePhaseIndex === 0) {
      progressBars = [primaryProgressBar, secondaryProgressBar];
    } else {
      progressBars = [secondaryProgressBar, primaryProgressBar];
    }

    return <TwoPhaseProgressBarContainer>{progressBars}</TwoPhaseProgressBarContainer>;
  };

  private renderPrimaryProgressBar = (): JSX.Element => {
    const progress = this.getProgress();
    const style = { width: `${(progress * 100).toString()}%` };
    return (
      <ProgressBarCountdownContainer key="progressBarPrimary">
        <ProgressBarDisplayLabel>{this.props.displayLabel}</ProgressBarDisplayLabel>
        <ProgressBarCountdownTotal>
          <ProgressBarCountdownProgress style={style} />
        </ProgressBarCountdownTotal>
      </ProgressBarCountdownContainer>
    );
  };

  private renderSecondaryProgressBar = (): JSX.Element => {
    const progress = this.props.activePhaseIndex === 0 ? 0 : 1;
    const style = { width: `${(progress * 100).toString()}%` };
    return (
      <ProgressBarCountdownContainer key="progressBarSecondary">
        <ProgressBarDisplayLabel>{this.props.secondaryDisplayLabel}</ProgressBarDisplayLabel>
        <ProgressBarCountdownTotal>
          <ProgressBarCountdownProgress style={style} />
        </ProgressBarCountdownTotal>
      </ProgressBarCountdownContainer>
    );
  };

  private renderExpiry = (): JSX.Element => {
    const [expiryDateString, expiryTimeString] = getLocalDateTimeStrings(this.props.endTime);
    return (
      <ProgressBarCopy>
        Newsroom listing {this.props.secondsRemaining! > 0 ? "is" : "was"} {this.props.flavorText} until{" "}
        {expiryDateString} {expiryTimeString}
      </ProgressBarCopy>
    );
  };

  private renderReadableTimeRemaining = (): JSX.Element => {
    if (this.props.secondsRemaining! > 0) {
      return (
        <MetaItem>
          <MetaItemValueAccent>{getReadableDuration(this.props.secondsRemaining!)}</MetaItemValueAccent>
          <MetaItemLabel>Remaining</MetaItemLabel>
        </MetaItem>
      );
    }
    return (
      <MetaItem>
        <MetaItemValueAccent>Ended</MetaItemValueAccent>
        <MetaItemLabel>&nbsp;</MetaItemLabel>
      </MetaItem>
    );
  };

  private getProgress = (): number => {
    if (this.props.secondsRemaining! > 0) {
      return 1 - this.props.secondsRemaining! / this.props.totalSeconds;
    }
    return 1;
  };
}
