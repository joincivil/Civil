import { Civil, ListingState } from "@joincivil/core";
import { apply, challenge, claimReward, updateStatus, commitVote, revealVote } from "../../scripts/tcrActions";
import { BigNumber } from "bignumber.js";

// Metamask is injected after full load
window.addEventListener("load", async () => {
  setNewsroomListeners();

  const civil = new Civil({ debug: true });
  const tcr = await civil.getDeployedOwnedAddressTCRWithAppeals();

  const urlString = window.location.href;
  const url = new URL(urlString);
  const address = url.searchParams.get("address")!;
  const state = await tcr.getListingState(address);

  const displayState = document.getElementById("state")!;
  displayState.innerHTML = "State: " + ListingState[state].toString();

  const challengeId = await tcr.getListingChallengeID(address);

  switch (state) {
    case ListingState.APPLYING:
      document.getElementById("application")!.classList.remove("hidden");
      const applicationExpiryTimestamp = await tcr.getApplicationExpiryTimestamp(address);
      const applicationExpiryDate = new Date(applicationExpiryTimestamp.toNumber() * 1000);
      document.getElementById("applicationInfo")!.innerHTML = "Application Phase active.<br>" +
        "If not challenged, listing can be whitelisted at: " + applicationExpiryDate;
      break;

    case ListingState.CHALLENGED_IN_COMMIT_VOTE_PHASE:
      document.getElementById("challenge")!.classList.remove("hidden");
      document.getElementById("commitVote")!.classList.remove("hidden");
      const commitVoteExpiryTimestamp = await tcr.getCommitVoteExpiryTimestamp(address);
      const commitVoteExpiryDate = new Date(commitVoteExpiryTimestamp.toNumber() * 1000);
      document.getElementById("challengeInfo")!.innerHTML = "Challenge active in Commit Vote phase.<br>" +
        "Commit Vote phase expires at: " + commitVoteExpiryDate + "<br>" +
        "Current Challenge ID: " + challengeId;
      break;

    case ListingState.CHALLENGED_IN_REVEAL_VOTE_PHASE:
      document.getElementById("challenge")!.classList.remove("hidden");
      document.getElementById("revealVote")!.classList.remove("hidden");
      const revealVoteExpiryTimestamp = await tcr.getRevealVoteExpiryTimestamp(address);
      const revealVoteExpiryDate = new Date(revealVoteExpiryTimestamp.toNumber() * 1000);
      document.getElementById("challengeInfo")!.innerHTML = "Challenge active in Reveal Vote phase.<br>" +
        "Reveal Vote phase expires at: " + revealVoteExpiryDate + "<br>" +
        "Current Challenge ID: " + challengeId;
      break;

    case ListingState.WAIT_FOR_APPEAL_REQUEST:
      document.getElementById("appeal")!.classList.remove("hidden");
      const waitForAppealExpiryTimestamp = await tcr.getRequestAppealExpiryTimestamp(address);
      const waitForAppealExpiryDate = new Date(waitForAppealExpiryTimestamp.toNumber() * 1000);
      document.getElementById("appealInfo")!.innerHTML = "Current waiting for listing owner to request appeal.<br>" +
        "Request phase expires at: " + waitForAppealExpiryDate;
      break;

    case ListingState.IN_APPEAL_PHASE:
      document.getElementById("appeal")!.classList.remove("hidden");
      const inAppealExpiryTimestamp = await tcr.getAppealExpiryTimestamp(address);
      const inAppealExpiryDate = new Date(inAppealExpiryTimestamp.toNumber() * 1000);
      document.getElementById("appealInfo")!.innerHTML = "Current waiting for JAB to judge appeal.<br>" +
        "Appeal phase expires at: " + inAppealExpiryDate;
      break;
  }

  tcr.failedChallengesForListing(address).subscribe((id) => {
    document.getElementById("resolvedChallenges")!.classList.remove("hidden");
    document.getElementById("resolvedChallengesInfo")!.innerHTML += id + ", ";
  });
  tcr.successfulChallengesForListing(address).subscribe((id) => {
    document.getElementById("resolvedChallenges")!.classList.remove("hidden");
    document.getElementById("resolvedChallengesInfo")!.innerHTML += id + ", ";
  });
});

function setNewsroomListeners(): void {
  const urlString = window.location.href;
  const url = new URL(urlString);
  const address = url.searchParams.get("address");
  const civil = new Civil({ debug: true });

  const applyButton = document.getElementById("param-applyToTCR")!;
  applyButton.onclick = async (event) => {
    if (address) {
      // TODO(nickreynolds): turn off button, display "deploying..."
      await apply(address, civil);
      // TODO(nickreynolds): show success
    } else {
      console.error("newsroom address not found in params");
    }
  };

  const challengeButton = document.getElementById("param-challengeTCRListing")!;
  challengeButton.onclick = async (event) => {
    if (address) {
      // TODO(nickreynolds): turn off button, display "deploying..."
      await challenge(address, civil);
      // TODO(nickreynolds): show success
    } else {
      console.error("newsroom address not found in params");
    }
  };

  const updateStatusButton = document.getElementById("param-updateListingStatus")!;
  updateStatusButton.onclick = async (event) => {
    if (address) {
      // TODO(nickreynolds): turn off button, display "updating..."
      await updateStatus(address, civil);
      // TODO(nickreynolds): show success
    } else {
      console.error("newsroom address not found in params");
    }
  };

  const proposeAndApproveButton = document.getElementById("param-proposeAndApprove")!;
  proposeAndApproveButton.onclick = async (event) => {
    // TODO(nickreynolds): fix fs
    // TODO(ritave): extract into scripts
    // const article = fs.readFileSync("assets/article.md").toString();
    const article = "This is article.";
    if (address) {
      console.log("Deploying newsroom");
      const deployedNewsroom = await civil.newsroomAtUntrusted(address);
      console.log("Proposing content");
      const articleId = await deployedNewsroom.proposeContent(article);
      console.log(`\tContent id: ${articleId}`);

      console.log("Approving content");
      // console.debug(await deployedNewsroom.approveContent(articleId).awaitReceipt());
      console.log("Done");

      window.location.assign("/article.html?newsroomAddress=" + address + "&articleId=" + articleId);

    } else {
      console.error("newsroom address not found in params");
    }
  };

  const commitVoteButton = document.getElementById("param-commitVote")!;
  commitVoteButton.onclick = async (event) => {
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
  revealVoteButton.onclick = async (event) => {
    const pollIDString = (document.getElementById("param-revealVotePollId")! as HTMLInputElement).value;
    const pollID = new BigNumber(pollIDString);
    const optionString = (document.getElementById("param-revealVoteOption")! as HTMLInputElement).value!;
    const option = new BigNumber(optionString);
    const saltString = (document.getElementById("param-revealVoteSalt")! as HTMLInputElement).value!;
    const salt = new BigNumber(saltString);
    await revealVote(pollID, option, salt);
  };

  const claimRewardButton = document.getElementById("param-claimReward")!;
  claimRewardButton.onclick = async (event) => {
    const pollIDString = (document.getElementById("param-claimRewardChallengeID")! as HTMLInputElement).value;
    const pollID = new BigNumber(pollIDString);
    const saltString = (document.getElementById("param-claimRewardSalt")! as HTMLInputElement).value;
    const salt = new BigNumber(saltString);
    await claimReward(pollID, salt);
  };
}
