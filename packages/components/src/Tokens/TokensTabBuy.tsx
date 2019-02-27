import * as React from "react";
import { TokensTabBuyActive } from "./TokensTabBuyActive";
import { TokensTabBuyComplete } from "./TokensTabBuyComplete";

export interface TokensBuyTabProps {
  foundationAddress: string;
  faqUrl: string;
  network: string;
  step: string;
  onBuyComplete(): void;
}

export const TokensBuyTab: React.StatelessComponent<TokensBuyTabProps> = props => {
  const { foundationAddress, network, faqUrl, step, onBuyComplete } = props;

  if (step === "completed") {
    return <TokensTabBuyComplete faqUrl={faqUrl} />;
  }

  return <TokensTabBuyActive foundationAddress={foundationAddress} network={network} onBuyComplete={onBuyComplete} />;
};
