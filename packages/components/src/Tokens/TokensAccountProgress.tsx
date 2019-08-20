import * as React from "react";
import { FlexColumnsSecondaryModule, TokenProgressContain } from "./TokensStyledComponents";
import {
  TokenConnectWalletCompletedText,
  TokenWalletAddressText,
  TokenQuizCompletedText,
} from "./TokensTextComponents";
import { EthAddressViewer } from "../EthAddressViewer";

export interface UserTokenAccountProgressProps {
  walletConnected?: boolean;
  quizCompleted?: boolean;
  userAccount: string;
  logInComplete: boolean;
  tutorialComplete: boolean;
}

export const UserTokenAccountProgress: React.FunctionComponent<UserTokenAccountProgressProps> = props => {
  let logInComplete;
  let tutorialComplete;

  if (props.logInComplete || props.tutorialComplete) {
    if (props.logInComplete) {
      logInComplete = (
        <TokenProgressContain>
          <TokenConnectWalletCompletedText />
          <EthAddressViewer address={props.userAccount} displayName={<TokenWalletAddressText />} />
        </TokenProgressContain>
      );
    }

    if (props.tutorialComplete) {
      tutorialComplete = (
        <TokenProgressContain>
          <TokenQuizCompletedText />
        </TokenProgressContain>
      );
    }

    return (
      <FlexColumnsSecondaryModule>
        {logInComplete}
        {tutorialComplete}
      </FlexColumnsSecondaryModule>
    );
  }

  return <></>;
};
