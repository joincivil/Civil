import * as React from "react";

import { CoreContext, useSelector, CenteredPage } from "@kirby-web3/child-react";
import { EthereumChildPlugin } from "@kirby-web3/plugin-ethereum";
import { ViewPlugin } from "@kirby-web3/child-core";
import { ClipLoader } from "@joincivil/elements";
import { WalletOptions } from "../common/input/WalletOptions";
import { SwitchAuthTypeDiv } from "../common/containers/layouts";

const WAITING_FOR_CONNECTION = "Waiting for Web3 Wallet Connection...";

export const Web3Enable: React.FC = () => {
  const ctx = React.useContext(CoreContext);
  const [status, setStatus] = React.useState("provided");
  const ethPlugin = ctx.core.plugins.ethereum as EthereumChildPlugin;

  const viewData = useSelector((state: any) => {
    if (state.view && state.view.queue && state.view.queue[0]) {
      return state.view.queue[0].data;
    }
  });

  React.useEffect(() => {
    if (viewData.requestID && viewData.providerPreference) {
      if (viewData.providerPreference) {
        selection(viewData.providerPreference as string, true).catch(err => console.log("error with selection", err));
      } else {
        setStatus("select");
      }
    }
  }, [viewData]);

  async function selection(provider: string, providerKnown: boolean = false): Promise<void> {
    console.log("selected:", provider, viewData.requestID, viewData.network);
    try {
      if (providerKnown) {
        setStatus("enabling known provider");
      } else {
        setStatus("enabling provider");
      }
      await ethPlugin.enableWeb3(viewData.requestID, provider, viewData.network as any);
      setStatus("done");

      (ctx.core.plugins.view as ViewPlugin).completeView();
    } catch (err) {
      console.log("error with enableWeb3: ", err);
      (ctx.core.plugins.view as ViewPlugin).completeView();
    }
  }

  if (status === "provided") {
    return <></>;
  } else if (status === "enabling known provider") {
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
      <strong>Enable your web3 wallet</strong>
      <WalletOptions onChange={selection} />
      <SwitchAuthTypeDiv>
        Don't want to connect a Web3 wallet at this time?{" "}
        <a
          onClick={() => {
            ethPlugin.cancelEnableWeb3(viewData.requestID);
            (ctx.core.plugins.view as ViewPlugin).completeView();
          }}
        >
          Close
        </a>
      </SwitchAuthTypeDiv>
    </CenteredPage>
  );
};
