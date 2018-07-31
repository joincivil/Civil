import * as React from "react";
import { compose } from "redux";
import { VoteTypeSummaryRow as PartialChallengeResultsComponent } from "@joincivil/components";
import { connectWinningChallengeResults, ChallengeContainerProps } from "../utility/HigherOrderComponents";

export const WinningChallengeResults = compose(connectWinningChallengeResults)(
  PartialChallengeResultsComponent,
) as React.ComponentClass<ChallengeContainerProps>;
