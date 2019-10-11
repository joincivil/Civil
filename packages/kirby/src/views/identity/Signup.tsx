import * as React from "react";
import { CoreContext, useSelector as useKirbySelector, CenteredPage } from "@kirby-web3/child-react";
import { RouteComponentProps } from "@reach/router";

import { Notice } from "../../common/text";
import { EthereumChildPlugin, ProviderTypes } from "@kirby-web3/plugin-ethereum";
import { CivilIDPlugin } from "../../plugins/CivilID";
import { ViewPlugin } from "@kirby-web3/child-core";
import { RadioGroup, RadioCardInput, Portis, MetaMask, ClipLoader } from "@joincivil/elements";
import styled from "styled-components";
import { SwitchAuthTypeDiv, WaitingForConnectionDiv } from "../../common/containers/layouts";

const CIVIL_DOMAINS = [
  "http://localhost:3000",
  "https://staging.civil.app",
  "https://test.civil.app",
  "https://registry.civil.co",
];

const WAITING_FOR_CONNECTION = "Waiting for Web3 Wallet Connection...";
const WAITING_FOR_SIGNATURE = "Waiting for Signature...";

const SignupFooter = styled.div`
  border-top: 1px solid #d8d8d8;
  margin-top: 40px;
  padding-top: 20px;
  text-align: center;
  font-size: 15px;
`;

export const Signup: React.FunctionComponent<RouteComponentProps> = () => {
  const ctx = React.useContext(CoreContext);
  const identityPlugin = ctx.core.plugins.civilid as CivilIDPlugin;
  const parentDomain = useKirbySelector((state: any) => state.iframe.parentDomain);
  const service = useKirbySelector((state: any) => state.civilid.pendingSignupRequest.service);
  const isCivil = service === "Civil" && CIVIL_DOMAINS.indexOf(parentDomain) > -1;
  const hasInjectedWeb3 = (window as any).ethereum;
  const [hideSelections, setHideSelections] = React.useState(false);
  const [selectionProcess, setSelectionProcess] = React.useState("none");

  React.useEffect(() => {
    (ctx.core.plugins.view as ViewPlugin).onParentClick(() => {
      identityPlugin.cancelSignup();
      (ctx.core.plugins.view as ViewPlugin).completeView();
    });
  }, [ctx.core.plugins.view, identityPlugin]);

  async function selection(provider: string): Promise<void> {
    setHideSelections(true);
    setSelectionProcess(WAITING_FOR_CONNECTION);
    const network = ctx.core.plugins.ethereum.config.defaultNetwork;
    const ethPlugin = ctx.core.plugins.ethereum as EthereumChildPlugin;
    const request = ctx.store.getState().civilid.pendingSignupRequest;

    await ethPlugin.changeProvider(provider, network as any);
    const accounts = await (ethPlugin.web3 as any).eth.getAccounts();
    const signer = accounts[0];

    console.log("preparing to sign:", signer, request);
    try {
      setSelectionProcess(WAITING_FOR_SIGNATURE);
      const signature = await (ethPlugin.web3 as any).eth.personal.sign(request.message, signer);
      identityPlugin.sendSignupResponse(signer, signature);
      setHideSelections(false);
    } catch (err) {
      console.error("error with signature");
      identityPlugin.cancelSignup();
      setHideSelections(false);
    }
    (ctx.core.plugins.view as ViewPlugin).completeView();
  }

  const metaMaskSubheading = hasInjectedWeb3
    ? "Your browser has Web3 built-in! Click here to use your built-in Web3 wallet."
    : "To use this option, you can install the MetaMask extension, or use another Web3 browser.";
  return (
    <CenteredPage>
      {isCivil ? null : (
        <Notice>
          <b>{parentDomain} !</b> would like you to sign up to their service.
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
          <RadioGroup name="LoginProvider" onChange={(_: string, provider: string) => selection(provider)}>
            <RadioCardInput
              image={<MetaMask />}
              value={ProviderTypes.METAMASK}
              heading="Sign up with MetaMask"
              subheading={metaMaskSubheading}
              disabled={!hasInjectedWeb3}
              prioritized={hasInjectedWeb3}
            />
            <RadioCardInput
              image={<Portis />}
              value={ProviderTypes.PORTIS}
              heading="Sign up with Portis"
              subheading="Wallet that does not require any downloads"
            />
          </RadioGroup>

          <SwitchAuthTypeDiv>
            Already a Civil member?{" "}
            <a
              onClick={() => {
                identityPlugin.cancelSignup("switch to log in");
                (ctx.core.plugins.view as ViewPlugin).completeView();
              }}
            >
              Click to Log In
            </a>
          </SwitchAuthTypeDiv>

          {isCivil ? renderTerms() : null}
        </>
      )}
    </CenteredPage>
  );

  function renderTerms(): JSX.Element {
    return (
      <SignupFooter>
        By signing up, you accept Civil's
        <a href="https://civil.co/terms" target="_blank">
          Terms of Use
        </a>{" "}
        and{" "}
        <a href="https://civil.co/privacy" target="_blank">
          Privacy Policy
        </a>
        .
      </SignupFooter>
    );
  }
};
