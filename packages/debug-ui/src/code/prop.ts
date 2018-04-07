import { Civil, ListingState, ParamProposalState } from "@joincivil/core";
import { challengeProp, claimReward, updateProp } from "../../scripts/parameterizerActions";
import { commitVote, revealVote } from "../../scripts/votingActions";
import { BigNumber } from "bignumber.js";

// Metamask is injected after full load
window.addEventListener("load", async () => {
  setPropListeners();

  const civil = new Civil({ debug: true });
  const tcr = await civil.tcrSingletonTrusted();
  const parameterizer = await tcr.getParameterizer();

  const urlString = window.location.href;
  const url = new URL(urlString);
  const id = url.searchParams.get("id")!;
  const state = await parameterizer.getPropState(id);

  const displayState = document.getElementById("state")!;
  displayState.innerHTML = "State: " + ParamProposalState[state].toString();

  const challengeId = await parameterizer.getChallengeID(id);

  switch (state) {
    case ParamProposalState.APPLYING:
      document.getElementById("application")!.classList.remove("hidden");
      const applicationExpiryDate = await parameterizer.getPropApplicationExpiry(id);
      document.getElementById("applicationInfo")!.innerHTML =
        "Application Phase active.<br>" + "If not challenged, listing can be whitelisted at: " + applicationExpiryDate;
      break;

    case ParamProposalState.CHALLENGED_IN_COMMIT_VOTE_PHASE:
      document.getElementById("challenge")!.classList.remove("hidden");
      document.getElementById("commitVote")!.classList.remove("hidden");
      const commitVoteExpiryDate = await parameterizer.getPropChallengeCommitExpiry(id);
      document.getElementById("challengeInfo")!.innerHTML =
        "Challenge active in Commit Vote phase.<br>" +
        "Commit Vote phase expires at: " +
        commitVoteExpiryDate +
        "<br>" +
        "Current Challenge ID: " +
        challengeId;
      break;

    case ParamProposalState.CHALLENGED_IN_REVEAL_VOTE_PHASE:
      document.getElementById("challenge")!.classList.remove("hidden");
      document.getElementById("revealVote")!.classList.remove("hidden");
      const revealVoteExpiryDate = await parameterizer.getPropChallengeRevealExpiry(id);
      document.getElementById("challengeInfo")!.innerHTML =
        "Challenge active in Reveal Vote phase.<br>" +
        "Reveal Vote phase expires at: " +
        revealVoteExpiryDate +
        "<br>" +
        "Current Challenge ID: " +
        challengeId;
      break;

    case ParamProposalState.READY_TO_PROCESS:
      document.getElementById("process")!.classList.remove("hidden");
      break;

    case ParamProposalState.READY_TO_RESOLVE_CHALLENGE:
      document.getElementById("processChallenge")!.classList.remove("hidden");
      break;
  }

  parameterizer.pollIDsForResolvedChallenges(id).subscribe(pollID => {
    document.getElementById("resolvedChallenges")!.classList.remove("hidden");
    document.getElementById("resolvedChallengesInfo")!.innerHTML += pollID + ", ";
  });
});

function setPropListeners(): void {
  const urlString = window.location.href;
  const url = new URL(urlString);
  const id = url.searchParams.get("id");
  const civil = new Civil({ debug: true });

  const challengeButton = document.getElementById("param-challengeProp")!;
  challengeButton.onclick = async event => {
    if (id) {
      // TODO(nickreynolds): turn off button, display "deploying..."
      await challengeProp(id, civil);
      // TODO(nickreynolds): show success
    } else {
      console.error("prop id not found in params");
    }
  };

  const updateStatusButton = document.getElementById("param-updatePropStatus")!;
  updateStatusButton.onclick = async event => {
    if (id) {
      // TODO(nickreynolds): turn off button, display "updating..."
      await updateProp(id, civil);
      // TODO(nickreynolds): show success
    } else {
      console.error("prop id not found in params");
    }
  };

  const commitVoteButton = document.getElementById("param-commitVote")!;
  commitVoteButton.onclick = async event => {
    const pollIDString = (document.getElementById("param-commitVotePollId")! as HTMLInputElement).value;
    const pollID = new BigNumber(pollIDString);
    const optionString = (document.getElementById("param-commitVoteOption")! as HTMLInputElement).value!;
    const option = new BigNumber(optionString);
    const saltString = (document.getElementById("param-commitVoteSalt")! as HTMLInputElement).value!;
    const salt = new BigNumber(saltString);
    const numTokensString = (document.getElementById("param-commitNumTokens")! as HTMLInputElement).value!;
    const numTokens = new BigNumber(numTokensString);
    await commitVote(pollID, option, salt, numTokens);
  };

  const revealVoteButton = document.getElementById("param-revealVote")!;
  revealVoteButton.onclick = async event => {
    const pollIDString = (document.getElementById("param-revealVotePollId")! as HTMLInputElement).value;
    const pollID = new BigNumber(pollIDString);
    const optionString = (document.getElementById("param-revealVoteOption")! as HTMLInputElement).value!;
    const option = new BigNumber(optionString);
    const saltString = (document.getElementById("param-revealVoteSalt")! as HTMLInputElement).value!;
    const salt = new BigNumber(saltString);
    await revealVote(pollID, option, salt);
  };

  const claimRewardButton = document.getElementById("param-claimReward")!;
  claimRewardButton.onclick = async event => {
    const pollIDString = (document.getElementById("param-claimRewardChallengeID")! as HTMLInputElement).value;
    const pollID = new BigNumber(pollIDString);
    const saltString = (document.getElementById("param-claimRewardSalt")! as HTMLInputElement).value;
    const salt = new BigNumber(saltString);
    await claimReward(pollID, salt);
  };
}
