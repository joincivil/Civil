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
  displayLabel: string;
  totalSeconds: number;
  flavorText?: string;
}
