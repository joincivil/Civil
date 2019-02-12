import * as React from "react";
import { compose } from "redux";
import { VoteTypeSummaryRow as PartialChallengeResultsComponent } from "@joincivil/components";
import { ChallengeContainerProps, AppealChallengeContainerProps } from "../utility/HigherOrderComponents";
import { connectWinningChallengeResults, WinningChallengeResultsProps } from "../utility/WinningChallengeResultsHOC";

export const WinningChallengeResults = compose(connectWinningChallengeResults)(
  PartialChallengeResultsComponent,
) as React.ComponentClass<ChallengeContainerProps & AppealChallengeContainerProps & WinningChallengeResultsProps>;
