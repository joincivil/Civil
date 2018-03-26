import { Civil } from "@joincivil/core";
import * as marked from "marked";
import BN, { BigNumber } from "bignumber.js";

import { requestVotingRights, withdrawVotingRights } from "../../scripts/tcrActions";

// Metamask is injected after full load
window.addEventListener("load", async () => {
  const civil = new Civil( { debug: true });
  if (civil.userAccount) {
    document.getElementById("account")!.innerHTML = "Account: " + civil.userAccount;
  } else {
    document.getElementById("account")!.innerHTML = "No Account Found. Must unlock metamask.";
  }

  const token = await civil.getEIP20ForDeployedTCR();
  const balance = await token.getBalance();
  document.getElementById("cvlBalance")!.innerHTML = "CVL Balance: " + balance;

  const voting = await civil.getVotingForDeployedTCR();
  const votingTokens = await voting.getNumVotingRights();
  document.getElementById("votingRights")!.innerHTML = "Voting Rights: " + votingTokens;

  setHeaderListeners();
});

function setHeaderListeners(): void {
  const getRightsButton = document.getElementById("param-requestVotingRights")!;
  getRightsButton.onclick = async () => {
    const numRightsRequested = (document.getElementById("param-numRightsToRequest")! as HTMLInputElement).value;
    const numRights = new BigNumber(numRightsRequested);
    console.log("request voting rights: " + numRights);
    await requestVotingRights(numRights);
  };

  const withdrawRightsButton = document.getElementById("param-withdrawVotingRights")!;
  withdrawRightsButton.onclick = async () => {
    const numRightsToWithdraw = (document.getElementById("param-numRightsToWithdraw")! as HTMLInputElement).value;
    const numRights = new BigNumber(numRightsToWithdraw);
    console.log("withdraw voting rights: " + numRights);
    await withdrawVotingRights(numRights);
  };
}
