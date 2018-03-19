import { Civil } from "@joincivil/core";
import * as marked from "marked";
import BN from "bignumber.js";

import { setIndexListeners } from "./listeners";

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
  document.getElementById("tcrInfo")!.innerHTML += "<br>Token: " + await tcr.getTokenAddress();
});
