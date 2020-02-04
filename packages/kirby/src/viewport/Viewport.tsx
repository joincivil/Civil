import * as React from "react";
import { useSelector as useKirbySelector } from "@kirby-web3/child-react";

import { Web3Enable } from "../views/Web3Enable";
import { SignatureConfirm } from "../views/SignatureConfirm";
import { Home } from "../views/trustedweb/Home";

export const Viewport: React.FC = () => {
  const view = useKirbySelector((state: any) => state.view.queue);

  if (view.length === 0) {
    return <div>empty queue</div>;
  } else {
    switch (view[0].route) {
      case "/ethereum/confirm-signature":
        return <SignatureConfirm />;
      case "/ethereum/web3enable":
        return <Web3Enable />;
      case "/trustedweb/authenticate":
        return <Home />;
      case "/trustedweb/home":
        return <Home />;
      default:
        // @ts-ignore
        return <div>error determining view</div>;
    }
  }
};
