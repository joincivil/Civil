import * as React from "react";

import { RadioGroup, RadioCardInput, MetaMask, Portis } from "@joincivil/elements";
import { ProviderTypes } from "@kirby-web3/plugin-ethereum";

export interface WalletOptionsProps {
  optionPrefix?: string;
  onChange(selection: ProviderTypes): void;
}

export const WalletOptions: React.FunctionComponent<WalletOptionsProps> = ({ optionPrefix, onChange }) => {
  const hasInjectedWeb3 = (window as any).ethereum;
  const metaMaskSubheading = hasInjectedWeb3
    ? "Your browser has Web3 built-in! Click here to use your built-in Web3 wallet."
    : "To use this option, you can install the MetaMask extension, or use another Web3 browser.";

  const prefix = optionPrefix ? optionPrefix + " " : "";

  return (
    <RadioGroup name="WalletOptions" onChange={(_: string, provider: ProviderTypes) => onChange(provider)}>
      <RadioCardInput
        image={<MetaMask />}
        value={ProviderTypes.METAMASK}
        heading={prefix + "MetaMask"}
        subheading={metaMaskSubheading}
        disabled={!hasInjectedWeb3}
        prioritized={hasInjectedWeb3}
      />
      <RadioCardInput
        image={<Portis />}
        value={ProviderTypes.PORTIS}
        heading={prefix + "Portis"}
        subheading="Web3 Wallet that does not require any downloads"
      />
    </RadioGroup>
  );
};
