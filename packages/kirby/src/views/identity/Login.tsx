import * as React from "react";
import { CoreContext, useSelector as useKirbySelector, CenteredPage } from "@kirby-web3/child-react";
import { RouteComponentProps } from "@reach/router";

import { RadioGroup, RadioCardInput, Incognito, Portis, MetaMask } from "@joincivil/elements";

import { Notice } from "../../common/text";
import { EthereumChildPlugin, ProviderTypes } from "@kirby-web3/plugin-ethereum";
import { CivilIDPlugin } from "../../plugins/CivilID";
import { ViewPlugin } from "@kirby-web3/child-core";

const CIVIL_DOMAINS = [
  "http://localhost:3000",
  "https://staging.civil.app",
  "https://test.civil.app",
  "https://registry.civil.co",
];

export const Login: React.FunctionComponent<RouteComponentProps> = () => {
  const ctx = React.useContext(CoreContext);
  const parentDomain = useKirbySelector((state: any) => state.iframe.parentDomain);
  const service = useKirbySelector((state: any) => state.civilid.pendingLoginRequest.service);
  const isCivil = service === "Civil" && CIVIL_DOMAINS.indexOf(parentDomain) > -1;

  async function selection(provider: string): Promise<void> {
    const network = ctx.core.plugins.ethereum.config.defaultNetwork;
    const ethPlugin = ctx.core.plugins.ethereum as EthereumChildPlugin;
    const identityPlugin = ctx.core.plugins.civilid as CivilIDPlugin;
    const request = ctx.store.getState().civilid.pendingLoginRequest;

    await ethPlugin.changeProvider(provider, network as any);
    const accounts = await (ethPlugin.web3 as any).eth.getAccounts();
    const signer = accounts[0];

    const signature = await (ethPlugin.web3 as any).eth.personal.sign(request.message, signer);

    identityPlugin.sendLoginResponse(signer, signature);
    (ctx.core.plugins.view as ViewPlugin).completeView();
  }

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
          subheading="Use an injected web3 provider such as MetaMask"
        />
        <RadioCardInput
          image={<Portis />}
          value={ProviderTypes.PORTIS}
          heading="Log in with Portis"
          subheading="Wallet that does not require any downloads"
        />
        <RadioCardInput
          image={<Incognito />}
          value={ProviderTypes.BURNER}
          heading="Log in Incognito"
          subheading="Wallet that is destroyed when you clear your cookies"
        />
      </RadioGroup>
    </CenteredPage>
  );
};