import * as React from "react";
import { CoreContext, useSelector as useKirbySelector } from "@kirby-web3/child-react";
import { RouteComponentProps } from "@reach/router";

import { RadioGroup, RadioCardInput, Incognito, Portis, MetaMask } from "@joincivil/elements";

import { PageLayout } from "../../common/containers/layouts";
import { Notice } from "../../common/text";
import { EthereumChildPlugin, ProviderTypes } from "@kirby-web3/plugin-ethereum";
import { CivilIDPlugin } from "../../plugins/CivilID";
import { ViewPlugin } from "@kirby-web3/child-core";

export const Login: React.FunctionComponent<RouteComponentProps> = () => {
  const ctx = React.useContext(CoreContext);
  const parentDomain = useKirbySelector((state: any) => state.iframe.parentDomain);

  async function selection(provider: string): Promise<void> {
    console.log("selection", provider);
    const network = "rinkeby";
    const ethPlugin = ctx.core.plugins.ethereum as EthereumChildPlugin;
    const identityPlugin = ctx.core.plugins.civilid as CivilIDPlugin;
    const request = ctx.store.getState().civilid.pendingLoginRequest;

    await ethPlugin.changeProvider(provider, network as any);
    const accounts = await (ethPlugin.web3 as any).eth.getAccounts();
    const signer = accounts[0];

    console.log("preparing to sign:", signer, request);
    const signature = await (ethPlugin.web3 as any).eth.personal.sign(request.message, signer);

    identityPlugin.sendLoginResponse(signer, signature);
    (ctx.core.plugins.view as ViewPlugin).completeView();
  }

  return (
    <PageLayout>
      <Notice>
        <b>{parentDomain}</b> is requesting to log in.
      </Notice>
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
          subheading="Portis "
        />
        <RadioCardInput
          image={<Incognito />}
          value={ProviderTypes.BURNER}
          heading="Log in Incognito"
          subheading="Use as temporary wallet that is destroyed when you clear your cookies"
        />
      </RadioGroup>
    </PageLayout>
  );
};
