import * as React from "react";
import { compose } from "redux";
import { SmallProgressBarCountdownTimer, ProgressBarCountdownProps, CountdownTimerProps } from "@joincivil/components";
import { connectPhaseCountdownTimer, PhaseCountdownTimerProps } from "../utility/HigherOrderComponents";

type TPhaseCountdownBarProps = ProgressBarCountdownProps & CountdownTimerProps;

const phaseCountdownTimerContainer = (WrappedComponent: React.ComponentClass<TPhaseCountdownBarProps>) => {
  const wrappedComponentContainer = (props: TPhaseCountdownBarProps) => {
    return <WrappedComponent {...props} />;
  };

  return compose(connectPhaseCountdownTimer)(wrappedComponentContainer) as React.ComponentClass<
    PhaseCountdownTimerProps
  >;
};

export const PhaseCountdownTimer = phaseCountdownTimerContainer(SmallProgressBarCountdownTimer);
