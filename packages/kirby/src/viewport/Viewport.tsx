import * as React from "react";
import { Router } from "@reach/router";

import { Web3Enable } from "../views/Web3Enable";
import { SignatureConfirm } from "../views/SignatureConfirm";
import { Login } from "../views/identity/Login";
import { Signup } from "../views/identity/Signup";

export const Viewport: React.FC = () => {
  return (
    <Router>
      <Web3Enable path="/ethereum/web3enable/:network" />
      <SignatureConfirm path="/ethereum/confirm-signature" />
      <Login path="/identity/login" />
      <Signup path="/identity/signup" />
    </Router>
  );
};
