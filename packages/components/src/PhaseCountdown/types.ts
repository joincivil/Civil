import * as React from "react";

export interface CountdownTimerProps {
  warn?: boolean | undefined;
  endTime: number;
}

export interface InjectedCountdownTimerProps {
  secondsRemaining?: number;
}

export interface CountdownTimerState {
  secondsRemaining: number;
}

export interface ProgressBarCountdownProps extends CountdownTimerProps {
  displayLabel: string | React.FunctionComponent | React.ComponentClass;
  totalSeconds: number;
  flavorText?: string | React.FunctionComponent | React.ComponentClass;
  toolTipText?: string | React.ReactNode;
}

export interface TwoPhaseProgressBarCountdownProps extends ProgressBarCountdownProps {
  activePhaseIndex: number;
  secondaryDisplayLabel: string | React.FunctionComponent | React.ComponentClass;
  secondaryToolTipText?: string | React.ReactNode;
}
