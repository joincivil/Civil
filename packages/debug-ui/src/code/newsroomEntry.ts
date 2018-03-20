import { setNewsroomListeners } from "./listeners";
import { Civil, ListingState } from "@joincivil/core";

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
      const commitVoteExpiryTimestamp = await tcr.getCommitVoteExpiryTimestamp(address);
      const commitVoteExpiryDate = new Date(commitVoteExpiryTimestamp.toNumber() * 1000);
      document.getElementById("challengeInfo")!.innerHTML = "Challenge active in Commit Vote phase..<br>" +
        "Commit Vote phase expires at: " + commitVoteExpiryDate;
      break;

    case ListingState.CHALLENGED_IN_REVEAL_VOTE_PHASE:
      document.getElementById("challenge")!.classList.remove("hidden");
      const revealVoteExpiryTimestamp = await tcr.getRevealVoteExpiryTimestamp(address);
      const revealVoteExpiryDate = new Date(revealVoteExpiryTimestamp.toNumber() * 1000);
      document.getElementById("challengeInfo")!.innerHTML = "Challenge active in Reveal Vote phase..<br>" +
        "Reveal Vote phase expires at: " + revealVoteExpiryDate;
      break;

    case ListingState.WAIT_FOR_APPEAL_REQUEST:
      document.getElementById("appeal")!.classList.remove("hidden");
      const waitForAppealExpiryTimestamp = await tcr.getRequestAppealExpiryTimestamp(address);
      const waitForAppealExpiryDate = new Date(waitForAppealExpiryTimestamp.toNumber() * 1000);
      document.getElementById("appealInfo")!.innerHTML = "Current waiting for listing owner to request appeal.<br>" +
        "Request phase expires at: " + waitForAppealExpiryDate;

    case ListingState.IN_APPEAL_PHASE:
      document.getElementById("appeal")!.classList.remove("hidden");
      const inAppealExpiryTimestamp = await tcr.getAppealExpiryTimestamp(address);
      const inAppealExpiryDate = new Date(inAppealExpiryTimestamp.toNumber() * 1000);
      document.getElementById("appealInfo")!.innerHTML = "Current waiting for JAB to judge appeal.<br>" +
        "Appeal phase expires at: " + inAppealExpiryDate;
      break;
  }
});
