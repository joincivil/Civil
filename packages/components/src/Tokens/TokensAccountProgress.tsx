import * as React from "react";
import { FlexColumnsSecondaryModule, TokenProgressContain } from "./TokensStyledComponents";
import { TokenConnectWalletCompletedText, TokenQuizCompletedText } from "./TokensTextComponents";
import { EthAddressViewer } from "../EthAddressViewer";

export interface UserTokenAccountProgressProps {
  walletConnected?: boolean;
  quizCompleted?: boolean;
  userAccount: string;
}

export const UserTokenAccountProgress: React.StatelessComponent<UserTokenAccountProgressProps> = props => {
  return (
    <FlexColumnsSecondaryModule>
      <TokenProgressContain>
        <TokenConnectWalletCompletedText />
        <EthAddressViewer address={props.userAccount} displayName="Your Public Wallet Address" />
      </TokenProgressContain>
      <TokenProgressContain>
        <TokenQuizCompletedText />
      </TokenProgressContain>
    </FlexColumnsSecondaryModule>
  );
};
