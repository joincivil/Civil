import * as React from "react";
import { getFormattedTokenBalance } from "@joincivil/utils";
import { AppealDecisionCard } from "@joincivil/components";

import { AppealDetailProps } from "./AppealDetail";

class AppealSubmitChallenge extends React.Component<AppealDetailProps> {
  public render(): JSX.Element {
    const challenge = this.props.challenge;
    const totalVotes = challenge.poll.votesAgainst.add(challenge.poll.votesFor);
    const votesFor = getFormattedTokenBalance(challenge.poll.votesFor);
    const votesAgainst = getFormattedTokenBalance(challenge.poll.votesAgainst);
    const percentFor = challenge.poll.votesFor
      .div(totalVotes)
      .mul(100)
      .toFixed(0);
    const percentAgainst = challenge.poll.votesAgainst
      .div(totalVotes)
      .mul(100)
      .toFixed(0);
    const appeal = this.props.appeal;
    const appealGranted = appeal.appealGranted;
    const endTime = appeal.appealOpenToChallengeExpiry.toNumber();
    const phaseLength = this.props.parameters.challengeAppealLen;

    const submitAppealChallengeURI = `/listing/${this.props.listingAddress}/submit-appeal-challenge`;

    return (
      <AppealDecisionCard
        endTime={endTime}
        challengeID={this.props.challengeID.toString()}
        challenger={challenge!.challenger.toString()}
        rewardPool={getFormattedTokenBalance(challenge!.rewardPool)}
        stake={getFormattedTokenBalance(challenge!.stake)}
        phaseLength={phaseLength}
        totalVotes={getFormattedTokenBalance(totalVotes)}
        votesFor={votesFor}
        votesAgainst={votesAgainst}
        percentFor={percentFor.toString()}
        percentAgainst={percentAgainst.toString()}
        appealGranted={appealGranted}
        submitAppealChallengeURI={submitAppealChallengeURI}
        onMobileTransactionClick={this.props.onMobileTransactionClick}
      />
    );
  }
}

export default AppealSubmitChallenge;
