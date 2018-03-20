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
    case ListingState.WAIT_FOR_APPEAL_REQUEST:
      document.getElementById("appeal")!.classList.remove("hidden");
      // document.getElementById("appeal")!.style.border = "thick solid #0000FF";
      const waitForAppealExpiryTimestamp = await tcr.getRequestAppealExpiryTimestamp(address);
      const date = new Date(waitForAppealExpiryTimestamp.toNumber() * 1000);
      document.getElementById("appealInfo")!.innerHTML = "Current waiting for listing owner to request appeal.<br>" +
        "Request phase expires at: " + date;
      break;
  }
});
