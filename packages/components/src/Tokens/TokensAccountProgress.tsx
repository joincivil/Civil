import * as React from "react";
import { FlexColumnsSecondaryModule, TokenProgressContain } from "./TokensStyledComponents";
import { TokenConnectWalletCompletedText, TokenWalletAddressText } from "./TokensTextComponents";
import { EthAddressViewer } from "../EthAddressViewer";

export interface UserTokenAccountProgressProps {
  userAccount: string;
  logInComplete: boolean;
}

export const UserTokenAccountProgress: React.FunctionComponent<UserTokenAccountProgressProps> = props => {
  if (props.logInComplete) {
    return (
      <FlexColumnsSecondaryModule>
        <TokenProgressContain>
          <TokenConnectWalletCompletedText />
          <EthAddressViewer address={props.userAccount} displayName={<TokenWalletAddressText />} />
        </TokenProgressContain>
      </FlexColumnsSecondaryModule>
    );
  }

  return <></>;
};
