import { storiesOf } from "@storybook/react";
import * as React from "react";
import { WalletSelector } from "./WalletSelector";
import { EthAddress } from "@joincivil/typescript-types";
import * as Web3 from "web3";
import { ProviderType } from "@joincivil/utils";

export interface IWalletSelectorProps {
  network: number;
  onProviderChange?(web3: Web3, providerType: ProviderType | undefined, account: EthAddress): void;
}

storiesOf("WalletSelector", module).add("selector", () => {
  const handleProviderChange = (web3: Web3, providerType: ProviderType, account: EthAddress) => {
    console.log({ web3, providerType, account });
  };
  return <WalletSelector network={4} onProviderChange={handleProviderChange} />;
});
