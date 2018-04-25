import { Civil } from "@joincivil/core";
import {
  apply,
  challenge,
  claimReward,
  updateStatus,
  requestAppeal,
  grantAppeal,
  challengeGrantedAppeal,
} from "../../scripts/tcrActions";
import { commitVote, revealVote } from "../../scripts/votingActions";
import { initializeDebugUI } from "../../scripts/civilActions";
import { BigNumber } from "bignumber.js";

initializeDebugUI(async civil => {
  setNewsroomListeners();

  const tcr = await civil.tcrSingletonTrusted();

  const urlString = window.location.href;
  const url = new URL(urlString);
  const address = url.searchParams.get("address")!;
  const listingData = await tcr.getListing(address).getListingData();

  const newsroom = await civil.newsroomAtUntrusted(address);
  const owners = await newsroom.owners();
  const multisig = await newsroom.getMultisigAddress();

  document.getElementById("owners")!.innerHTML += owners;
  document.getElementById("multisig")!.innerHTML += multisig;
  document.getElementById("listingData")!.innerHTML += JSON.stringify(listingData, null, 2);

  tcr
    .getListing(address)
    .compositeObservables()
    .subscribe(event => {
      document.getElementById("events")!.classList.remove("hidden");
      const obj = event.args;
      document.getElementById("eventsInfo")!.innerHTML += event.event + JSON.stringify(obj, null, 2) + "<br/>";
    });
});

function setNewsroomListeners(): void {
  const urlString = window.location.href;
  const url = new URL(urlString);
  const address = url.searchParams.get("address");
  const civil = new Civil({ debug: true });

  const applyButton = document.getElementById("param-applyToTCR")!;
  applyButton.onclick = async event => {
    if (address) {
      await apply(address, new BigNumber(1000), civil);
    } else {
      console.error("newsroom address not found in params");
    }
  };

  const challengeButton = document.getElementById("param-challengeTCRListing")!;
  challengeButton.onclick = async event => {
    if (address) {
      await challenge(address, civil);
    } else {
      console.error("newsroom address not found in params");
    }
  };

  const requestAppealButton = document.getElementById("param-requestAppeal")!;
  requestAppealButton.onclick = async event => {
    if (address) {
      await requestAppeal(address, civil);
    } else {
      console.error("newsroom address not found in params");
    }
  };

  const grantAppealButton = document.getElementById("param-grantAppeal")!;
  grantAppealButton.onclick = async event => {
    if (address) {
      await grantAppeal(address, civil);
    } else {
      console.error("newsroom address not found in params");
    }
  };

  const challengeAppealButton = document.getElementById("param-challengeAppeal")!;
  challengeAppealButton.onclick = async event => {
    if (address) {
      await challenge(address, civil);
    } else {
      console.error("newsroom address not found in params");
    }
  };

  const updateStatusButton = document.getElementById("param-updateListingStatus")!;
  updateStatusButton.onclick = async event => {
    if (address) {
      await updateStatus(address, civil);
    } else {
      console.error("newsroom address not found in params");
    }
  };

  const proposeAndApproveButton = document.getElementById("param-proposeAndApprove")!;
  proposeAndApproveButton.onclick = async event => {
    // TODO(nickreynolds): fix fs
    // TODO(ritave): extract into scripts
    // const article = fs.readFileSync("assets/article.md").toString();
    const article = "This is article.";
    if (address) {
      console.log("Deploying newsroom");
      const deployedNewsroom = await civil.newsroomAtUntrusted(address);
      console.log("Proposing content");
      const articleId = await deployedNewsroom.publishRevision(article);
      console.log(`\tContent id: ${articleId}`);

      console.log("Done");

      window.location.assign("/article.html?newsroomAddress=" + address + "&articleId=" + articleId);
    } else {
      console.error("newsroom address not found in params");
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
