import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Civil } from "@joincivil/core";
import { WalletOnboarding } from ".";

let civil: Civil | undefined;
try {
  civil = new Civil();
} catch (error) {
  civil = undefined;
}

storiesOf("Wallet Onboarding", module)
  .add("No Provider", () => {
    return <WalletOnboarding enable={() => {}} noProvider={true} />;
  })
  .add("Not Enabled", () => {
    return <WalletOnboarding enable={() => {}} notEnabled={true} />;
  })
  .add("Locked", () => {
    return <WalletOnboarding enable={() => {}} walletLocked={true} />;
  })
  .add("Wrong Network", () => {
    return <WalletOnboarding enable={() => {}} wrongNetwork={true} requiredNetworkNiceName="Main Ethereum Network" />;
  })
  .add("Save address to CMS profile", () => {
    return (
      <WalletOnboarding enable={() => {}} metamaskWalletAddress="0xabc123" saveAddressToProfile={async () => {}} />
    );
  })
  .add("CMS profile vs. MetaMask address mismatch", () => {
    return (
      <WalletOnboarding
        enable={() => {}}
        metamaskWalletAddress="0xabc123"
        profileWalletAddress="0x123abc"
        saveAddressToProfile={async () => {}}
      />
    );
  })
  .add("Save wallet to account", () => {
    return (
      <>
        <WalletOnboarding enable={() => {}} metamaskWalletAddress="0xabc123" civil={civil} requireAuth={true} />
      </>
    );
  })
  .add("Connected", () => {
    return <WalletOnboarding enable={() => {}} metamaskWalletAddress="0xabc123" />;
  });
