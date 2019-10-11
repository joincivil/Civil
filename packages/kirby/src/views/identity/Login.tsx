import * as React from "react";
import { CoreContext, useSelector as useKirbySelector, CenteredPage } from "@kirby-web3/child-react";
import { RouteComponentProps } from "@reach/router";

import { RadioGroup, RadioCardInput, Portis, MetaMask } from "@joincivil/elements";

import { Notice } from "../../common/text";
import { EthereumChildPlugin, ProviderTypes } from "@kirby-web3/plugin-ethereum";
import { CivilIDPlugin } from "../../plugins/CivilID";
import { ViewPlugin } from "@kirby-web3/child-core";
import styled from "styled-components";

const CIVIL_DOMAINS = [
  "http://localhost:3000",
  "https://staging.civil.app",
  "https://test.civil.app",
  "https://registry.civil.co",
];

const SwitchToSignUpDiv = styled.div`
  margin-top:10px;
  margin-bottom:10px;
  margin-left: 10px;
`;

export const Login: React.FunctionComponent<RouteComponentProps> = () => {
  const ctx = React.useContext(CoreContext);
  const identityPlugin = ctx.core.plugins.civilid as CivilIDPlugin;
  const parentDomain = useKirbySelector((state: any) => state.iframe.parentDomain);
  const service = useKirbySelector((state: any) => state.civilid.pendingLoginRequest.service);
  const isCivil = service === "Civil" && CIVIL_DOMAINS.indexOf(parentDomain) > -1;
  const hasInjectedWeb3 = (window as any).ethereum;

  React.useEffect(() => {
    (ctx.core.plugins.view as ViewPlugin).onParentClick(() => {
      identityPlugin.cancelLogin();
      (ctx.core.plugins.view as ViewPlugin).completeView();
    });
  }, [ctx.core.plugins.view, identityPlugin]);

  async function selection(provider: string): Promise<void> {
    const network = ctx.core.plugins.ethereum.config.defaultNetwork;
    const ethPlugin = ctx.core.plugins.ethereum as EthereumChildPlugin;
    const request = ctx.store.getState().civilid.pendingLoginRequest;

    await ethPlugin.changeProvider(provider, network as any);
    const accounts = await (ethPlugin.web3 as any).eth.getAccounts();
    const signer = accounts[0];

    try {
      const signature = await (ethPlugin.web3 as any).eth.personal.sign(request.message, signer);
      identityPlugin.sendLoginResponse(signer, signature);
    } catch (err) {
      console.error("error with signature");
      identityPlugin.cancelLogin(err);
    }

    (ctx.core.plugins.view as ViewPlugin).completeView();
  }

  const metaMaskSubheading = hasInjectedWeb3 ?
    "Your browser has Web3 built-in! Click here to use your built-in Web3 wallet." :
    "To use this option, you can install the MetaMask extension, or use another Web3 browser.";
  return (
    <CenteredPage>
      {isCivil ? null : (
        <Notice>
          <b>{parentDomain}</b> is requesting to log in.
        </Notice>
      )}

      <RadioGroup name="LoginProvider" onChange={(_: string, provider: string) => selection(provider)}>
        <RadioCardInput
          image={<MetaMask />}
          value={ProviderTypes.METAMASK}
          heading="Log in with MetaMask"
          subheading={metaMaskSubheading}
          disabled={!hasInjectedWeb3}
          prioritized={hasInjectedWeb3}
        />
        <RadioCardInput
          image={<Portis />}
          value={ProviderTypes.PORTIS}
          heading="Log in with Portis"
          subheading="Web3 Wallet that does not require any downloads"
        />
      </RadioGroup>
      <SwitchToSignUpDiv>
        Not a Civil member?{" "}
        <a onClick={() => {
          identityPlugin.cancelLogin("switch to sign up");
          (ctx.core.plugins.view as ViewPlugin).completeView();
        }}>Sign up to join</a>
      </SwitchToSignUpDiv>
    </CenteredPage>
  );
};
