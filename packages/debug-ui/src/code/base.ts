import { Civil } from "@joincivil/core";
import * as marked from "marked";
import BN from "bignumber.js";

import { setIndexListeners } from "./listeners";

// Metamask is injected after full load
window.addEventListener("load", async () => {
  const civil = new Civil( { debug: true });
  if (civil.userAccount) {
    document.getElementById("account")!.innerHTML = "Account: " + civil.userAccount;
  } else {
    document.getElementById("account")!.innerHTML = "No Account Found. Must unlock metamask.";
  }

  const token = await civil.getEIP20ForDeployedTCR();
  const balance = await token.getBalance(civil.userAccount);
  document.getElementById("cvlBalance")!.innerHTML = "CVL Balance: " + balance;
});
