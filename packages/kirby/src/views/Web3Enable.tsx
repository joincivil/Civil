import * as React from "react";
import queryString from "query-string";
import { RouteComponentProps } from "@reach/router";

import { LogInWithMetaMask, LogInWithPortis, CoreContext, useSelector, CenteredPage } from "@kirby-web3/child-react";
import { EthereumChildPlugin } from "@kirby-web3/plugin-ethereum";
import { ViewPlugin } from "@kirby-web3/child-core";
import { ClipLoader } from "@joincivil/elements";

interface Web3EnableProps extends RouteComponentProps {
  network?: string;
}

const WAITING_FOR_CONNECTION = "Waiting for Web3 Wallet Connection...";

export const Web3Enable: React.FC<Web3EnableProps> = ({ network, location }) => {
  const ctx = React.useContext(CoreContext);
  const [status, setStatus] = React.useState("provided");

  const requestID = useSelector((state: any) => {
    if (state.view && state.view.queue && state.view.queue[0]) {
      return state.view.queue[0].requestID;
    }
  });

  React.useEffect(() => {
    if (requestID) {
      const queryParams = queryString.parse(location!.search);
      if (queryParams.providerPreference) {
        selection(queryParams.providerPreference as string).catch(err => console.log("error with selection", err));
      } else {
        setStatus("select");
      }
    }
  }, [requestID]);

  async function selection(provider: string): Promise<void> {
    const ethPlugin = ctx.core.plugins.ethereum as EthereumChildPlugin;
    console.log("selected:", provider, requestID, network);
    try {
      setStatus("enabling provider");
      await ethPlugin.enableWeb3(requestID, provider, network as any);
      setStatus("done");

      (ctx.core.plugins.view as ViewPlugin).completeView();
    } catch (err) {
      console.log("error with enableWeb3: ", err);
      (ctx.core.plugins.view as ViewPlugin).completeView();
    }
  }

  if (status === "provided") {
    return <></>;
  } else if (status === "enabling provider") {
    return (
      <CenteredPage>
        <ClipLoader />
        <span>{WAITING_FOR_CONNECTION}</span>
      </CenteredPage>
    );
  }

  return (
    <CenteredPage>
      <LogInWithMetaMask onSelection={selection} />
      <LogInWithPortis onSelection={selection} />
    </CenteredPage>
  );
};
