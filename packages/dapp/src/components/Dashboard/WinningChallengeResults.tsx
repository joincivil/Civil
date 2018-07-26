import * as React from "react";
import { compose } from "redux";
import { VoteTypeSummaryRow as PartialChallengeResultsComponent, VoteTypeSummaryRowProps } from "@joincivil/components";
import { connectWinningChallengeResults, ChallengeContainerProps } from "../utility/HigherOrderComponents";

const winningChallengeResultsContainer = (WrappedComponent: React.StatelessComponent<VoteTypeSummaryRowProps>) => {
  const wrappedChallengeResults = (props: VoteTypeSummaryRowProps) => {
    return <WrappedComponent {...props} />;
  };

  return compose(connectWinningChallengeResults)(wrappedChallengeResults) as React.ComponentClass<
    ChallengeContainerProps
  >;
};

export const WinningChallengeResults = winningChallengeResultsContainer(PartialChallengeResultsComponent);
