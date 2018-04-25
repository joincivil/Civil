import { Civil, ListingWrapper } from "@joincivil/core";
import * as marked from "marked";
import BN from "bignumber.js";
import { deployNewsroom } from "../../scripts/deploy-newsroom";
import { initializeDebugUI } from "../../scripts/civilActions";

initializeDebugUI(async civil => {
  setIndexListeners();
  const tcr = await civil.tcrSingletonTrusted();
  tcr.listingsInApplicationStage().subscribe((listing: ListingWrapper) => {
    document.getElementById("applications")!.innerHTML +=
      "<br>- <a href='/newsroom.html?address=" + listing.address + "'>" + listing.address + "</a>";
  });
  tcr
    .whitelistedListings()
    .distinct()
    .subscribe((listing: ListingWrapper) => {
      document.getElementById("whitelist")!.innerHTML +=
        "<br>- <a href='/newsroom.html?address=" + listing.address + "'>" + listing.address + "</a>";
    });
  tcr
    .readyToBeWhitelistedListings()
    .distinct()
    .subscribe((listing: ListingWrapper) => {
      document.getElementById("readyToWhitelist")!.innerHTML +=
        "<br>- <a href='/newsroom.html?address=" + listing.address + "'>" + listing.address + "</a>";
    });
  tcr
    .currentChallengedCommitVotePhaseListings()
    .distinct()
    .subscribe((listing: ListingWrapper) => {
      document.getElementById("challengedInCommit")!.innerHTML +=
        "<br>- <a href='/newsroom.html?address=" + listing.address + "'>" + listing.address + "</a>";
    });
  tcr
    .currentChallengedRevealVotePhaseListings()
    .distinct()
    .subscribe((listing: ListingWrapper) => {
      document.getElementById("challengedInReveal")!.innerHTML +=
        "<br>- <a href='/newsroom.html?address=" + listing.address + "'>" + listing.address + "</a>";
    });
  tcr
    .listingsWithChallengeToResolve()
    .distinct()
    .subscribe((listing: ListingWrapper) => {
      document.getElementById("canBeUpdated")!.innerHTML +=
        "<br>- <a href='/newsroom.html?address=" + listing.address + "'>" + listing.address + "</a>";
    });
  tcr
    .listingsAwaitingAppealRequest()
    .distinct()
    .subscribe((listing: ListingWrapper) => {
      document.getElementById("awaitingAppealRequest")!.innerHTML +=
        "<br>- <a href='/newsroom.html?address=" + listing.address + "'>" + listing.address + "</a>";
    });
  tcr
    .listingsAwaitingAppealJudgment()
    .distinct()
    .subscribe((listing: ListingWrapper) => {
      document.getElementById("awaitingAppealJudgment")!.innerHTML +=
        "<br>- <a href='/newsroom.html?address=" + listing.address + "'>" + listing.address + "</a>";
    });
  tcr
    .listingsAwaitingAppealChallenge()
    .distinct()
    .subscribe((listing: ListingWrapper) => {
      document.getElementById("awaitingAppealChallenge")!.innerHTML +=
        "<br>- <a href='/newsroom.html?address=" + listing.address + "'>" + listing.address + "</a>";
    });
  tcr
    .listingsInAppealChallengeCommitPhase()
    .distinct()
    .subscribe((listing: ListingWrapper) => {
      document.getElementById("inAppealChallengeCommit")!.innerHTML +=
        "<br>- <a href='/newsroom.html?address=" + listing.address + "'>" + listing.address + "</a>";
    });
  tcr
    .listingsInAppealChallengeRevealPhase()
    .distinct()
    .subscribe((listing: ListingWrapper) => {
      document.getElementById("inAppealChallengeReveal")!.innerHTML +=
        "<br>- <a href='/newsroom.html?address=" + listing.address + "'>" + listing.address + "</a>";
    });
  tcr
    .listingsWithAppealToResolve()
    .distinct()
    .subscribe((listing: ListingWrapper) => {
      document.getElementById("appealCanBeResolved")!.innerHTML +=
        "<br>- <a href='/newsroom.html?address=" + listing.address + "'>" + listing.address + "</a>";
    });
  document.getElementById("tcrInfo")!.innerHTML += "<br>Token: " + (await tcr.getTokenAddress());

  document.getElementById("parameterizer")!.innerHTML += " " + (await tcr.getParameterizerAddress());
});

function setIndexListeners(): void {
  const deployButton = document.getElementById("param-deployNewsroom")!;
  deployButton.onclick = async event => {
    const newsroomAddress = await deployNewsroom("Test name");
    window.location.assign("/newsroom.html?address=" + newsroomAddress);
  };
}
