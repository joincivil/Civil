import { Civil } from "@joincivil/core";
import * as marked from "marked";
import BN from "bignumber.js";
import { deployNewsroom } from "../../scripts/deploy-newsroom";

// Metamask is injected after full load
window.addEventListener("load", async () => {
  setIndexListeners();
  const civil = new Civil({ debug: true });
  const tcr = await civil.getDeployedOwnedAddressTCRWithAppeals();
  tcr.listingsInApplicationStage().subscribe((listing: string) => {
    document.getElementById("applications")!.innerHTML += "<br>- <a href='/newsroom.html?address=" +
      listing + "'>" + listing + "</a>";
  });
  tcr.whitelistedListings().subscribe((listing: string) => {
    document.getElementById("whitelist")!.innerHTML += "<br>- <a href='/newsroom.html?address=" +
    listing + "'>" + listing + "</a>";
  });
  tcr.readyToBeWhitelistedListings().subscribe((listing: string) => {
    document.getElementById("readyToWhitelist")!.innerHTML += "<br>- <a href='/newsroom.html?address=" +
    listing + "'>" + listing + "</a>";
  });
  tcr.currentChallengedCommitVotePhaseListings().subscribe((listing: string) => {
    document.getElementById("challengedInCommit")!.innerHTML += "<br>- <a href='/newsroom.html?address=" +
    listing + "'>" + listing + "</a>";
  });
  tcr.currentChallengedRevealVotePhaseListings().subscribe((listing: string) => {
    document.getElementById("challengedInReveal")!.innerHTML += "<br>- <a href='/newsroom.html?address=" +
    listing + "'>" + listing + "</a>";
  });
  document.getElementById("tcrInfo")!.innerHTML += "<br>Token: " + await tcr.getTokenAddress();
});

function setIndexListeners(): void {
  const deployButton = document.getElementById("param-deployNewsroom")!;
  deployButton.onclick = async (event) => {
    const newsroomAddress = await deployNewsroom("Test name");
    window.location.assign("/newsroom.html?address=" + newsroomAddress);
  };
}
