import * as React from "react";
import { LogInWithMetaMask, LogInWithPortis, LogInWithBurner, CoreContext, useSelector } from "@kirby-web3/child-react";
import { EthereumChildPlugin } from "@kirby-web3/plugin-ethereum";
import { RouteComponentProps } from "@reach/router";
import { ViewPlugin } from "@kirby-web3/child-core";

interface Web3EnableProps extends RouteComponentProps {
  network?: string;
}

export const Web3Enable: React.FC<Web3EnableProps> = ({ network }) => {
  const ctx = React.useContext(CoreContext);
  const requestID = useSelector((state: any) => {
    if (state.view && state.view.queue && state.view.queue[0]) {
      return state.view.queue[0].requestID;
    }
  });
  function selection(provider: string): void {
    console.log("selected:", provider);
    (ctx.core.plugins.ethereum as EthereumChildPlugin).enableWeb3(requestID, provider, network as any).catch(err => {
      console.log("error with enableWeb3: ", err);
    });
    (ctx.core.plugins.view as ViewPlugin).completeView();
  }
  return (
    <div>
      <LogInWithMetaMask onSelection={selection} />
      <LogInWithPortis onSelection={selection} />
      <LogInWithBurner onSelection={selection} />
    </div>
  );
};
