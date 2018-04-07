import { Civil } from "@joincivil/core";
import * as marked from "marked";
import BN from "bignumber.js";
import { deployNewsroom } from "../../scripts/deploy-newsroom";
import { initializeDebugUI } from "../../scripts/civilActions";

initializeDebugUI(async (civil) => {
  setIndexListeners();
  const tcr = await civil.tcrSingletonTrusted();
  tcr.listingsInApplicationStage().subscribe((listing: string) => {
    document.getElementById("applications")!.innerHTML += "<br>- <a href='/newsroom.html?address=" +
      listing + "'>" + listing + "</a>";
  });
  tcr.whitelistedListings().distinct().subscribe((listing: string) => {
    document.getElementById("whitelist")!.innerHTML += "<br>- <a href='/newsroom.html?address=" +
    listing + "'>" + listing + "</a>";
  });
  tcr.readyToBeWhitelistedListings().distinct().subscribe((listing: string) => {
    document.getElementById("readyToWhitelist")!.innerHTML += "<br>- <a href='/newsroom.html?address=" +
    listing + "'>" + listing + "</a>";
  });
  tcr.currentChallengedCommitVotePhaseListings().distinct().subscribe((listing: string) => {
    document.getElementById("challengedInCommit")!.innerHTML += "<br>- <a href='/newsroom.html?address=" +
    listing + "'>" + listing + "</a>";
  });
  tcr.currentChallengedRevealVotePhaseListings().distinct().subscribe((listing: string) => {
    document.getElementById("challengedInReveal")!.innerHTML += "<br>- <a href='/newsroom.html?address=" +
    listing + "'>" + listing + "</a>";
  });
  tcr.listingsAwaitingUpdate().distinct().subscribe((listing: string) => {
    document.getElementById("canBeUpdated")!.innerHTML += "<br>- <a href='/newsroom.html?address=" +
    listing + "'>" + listing + "</a>";
  });
  tcr.listingsAwaitingAppealRequest().distinct().subscribe((listing: string) => {
    document.getElementById("awaitingAppealRequest")!.innerHTML += "<br>- <a href='/newsroom.html?address=" +
    listing + "'>" + listing + "</a>";
  });
  tcr.listingsAwaitingAppeal().distinct().subscribe((listing: string) => {
    document.getElementById("awaitingAppeal")!.innerHTML += "<br>- <a href='/newsroom.html?address=" +
    listing + "'>" + listing + "</a>";
  });
  document.getElementById("tcrInfo")!.innerHTML += "<br>Token: " + await tcr.getTokenAddress();

  document.getElementById("parameterizer")!.innerHTML += " " + await tcr.getParameterizerAddress();
});

function setIndexListeners(): void {
  const deployButton = document.getElementById("param-deployNewsroom")!;
  deployButton.onclick = async (event) => {
    const newsroomAddress = await deployNewsroom("Test name");
    window.location.assign("/newsroom.html?address=" + newsroomAddress);
  };
}
