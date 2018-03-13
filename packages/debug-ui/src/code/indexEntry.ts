import { Civil } from "@joincivil/core";
import * as marked from "marked";
import BN from "bignumber.js";

import { setIndexListeners } from "./listeners";

// Metamask is injected after full load
window.addEventListener("load", async () => {
  setIndexListeners();
  const civil = new Civil();
  const tcr = await civil.ownedAddressTCRWithAppealsAtUntrusted("0x5cf4114912d0b1eacF666E1c6b9fc91eb143956b");
  tcr.currentAppliedListings().subscribe((listing: string) => {
    document.getElementById("applications")!.innerHTML += "<br>- " + listing;
  });
  tcr.whitelistedListings().subscribe((listing: string) => {
    document.getElementById("whitelist")!.innerHTML += "<br>- " + listing;
  });
  document.getElementById("tcrInfo")!.innerHTML += "<br>Token: " + await tcr.getTokenAddress();
});
