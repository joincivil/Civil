import * as React from "react";
import { CoreContext, useSelector as useKirbySelector, CenteredPage } from "@kirby-web3/child-react";
import { RouteComponentProps } from "@reach/router";

import { ClipLoader } from "@joincivil/elements";

import { Notice } from "../../common/text";
import { EthereumChildPlugin } from "@kirby-web3/plugin-ethereum";
import { CivilIDPlugin } from "../../plugins/CivilID";
import { ViewPlugin } from "@kirby-web3/child-core";
import { WaitingForConnectionDiv, SwitchAuthTypeDiv } from "../../common/containers/layouts";
import { WalletOptions } from "../../common/input/WalletOptions";

const CIVIL_DOMAINS = [
  "http://localhost:3000",
  "https://staging.civil.app",
  "https://test.civil.app",
  "https://registry.civil.co",
];

const WAITING_FOR_CONNECTION = "Waiting for Web3 Wallet Connection...";
const WAITING_FOR_SIGNATURE = "Waiting for Signature...";

export const Login: React.FunctionComponent<RouteComponentProps> = () => {
  const ctx = React.useContext(CoreContext);
  const identityPlugin = ctx.core.plugins.civilid as CivilIDPlugin;
  const parentDomain = useKirbySelector((state: any) => state.iframe.parentDomain);
  const service = useKirbySelector((state: any) => state.civilid.pendingLoginRequest.service);
  const isCivil = service === "Civil" && CIVIL_DOMAINS.indexOf(parentDomain) > -1;
  const [hideSelections, setHideSelections] = React.useState(false);
  const [selectionProcess, setSelectionProcess] = React.useState("none");

  React.useEffect(() => {
    (ctx.core.plugins.view as ViewPlugin).onParentClick(() => {
      identityPlugin.cancelLogin();
      (ctx.core.plugins.view as ViewPlugin).completeView();
    });
  }, [ctx.core.plugins.view, identityPlugin]);

  async function selection(provider: string): Promise<void> {
    setHideSelections(true);
    setSelectionProcess(WAITING_FOR_CONNECTION);
    const network = ctx.core.plugins.ethereum.config.defaultNetwork;
    const ethPlugin = ctx.core.plugins.ethereum as EthereumChildPlugin;
    const request = ctx.store.getState().civilid.pendingLoginRequest;

    await ethPlugin.changeProvider(provider, network as any);
    const accounts = await (ethPlugin.web3 as any).eth.getAccounts();
    const signer = accounts[0];

    try {
      setSelectionProcess(WAITING_FOR_SIGNATURE);
      const signature = await (ethPlugin.web3 as any).eth.personal.sign(request.message, signer);
      identityPlugin.sendLoginResponse(signer, signature);
    } catch (err) {
      console.error("error with signature");
      identityPlugin.cancelLogin(err);
    }

    (ctx.core.plugins.view as ViewPlugin).completeView();
  }

  return (
    <CenteredPage>
      {isCivil ? null : (
        <Notice>
          <b>{parentDomain}</b> is requesting to log in.
        </Notice>
      )}

      {hideSelections && (
        <WaitingForConnectionDiv>
          <ClipLoader size={100} />
          <>{selectionProcess}</>
        </WaitingForConnectionDiv>
      )}
      {!hideSelections && (
        <>
          <WalletOptions optionPrefix="Log in with " onChange={selection} />
          <SwitchAuthTypeDiv>
            Not a Civil member?{" "}
            <a
              onClick={() => {
                identityPlugin.cancelLogin("switch to sign up");
                (ctx.core.plugins.view as ViewPlugin).completeView();
              }}
            >
              Sign up to join
            </a>
          </SwitchAuthTypeDiv>
        </>
      )}
    </CenteredPage>
  );
};
