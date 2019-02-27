import * as React from "react";
import { TokensTabSellActive } from "./TokensTabSellActive";
import { TokensTabSellComplete } from "./TokensTabSellComplete";
import { TokensTabSellUnlock } from "./TokensTabSellUnlock";

export interface TokensSellTabProps {
  foundationAddress: string;
  network: string;
  step: string;
  onSellComplete(): void;
}

export const TokensSellTab: React.StatelessComponent<TokensSellTabProps> = props => {
  const { network, step, onSellComplete } = props;

  if (step === "unlock") {
    return <TokensTabSellUnlock />;
  } else if (step === "completed") {
    return <TokensTabSellComplete />;
  }

  return <TokensTabSellActive network={network} onSellComplete={onSellComplete} />;
};
