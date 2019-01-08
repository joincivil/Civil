import * as React from "react";
import { TokenAccountOuter, TokenAccountInner } from "./TokensStyledComponents";
import { UserTokenAccountHeader } from "./TokensAccountHeader";
import { UserTokenAccountHelp } from "./TokensAccountHelp";

export const UserTokenAccount: React.StatelessComponent = props => {
  return (
    <TokenAccountOuter>
      <TokenAccountInner>
        <UserTokenAccountHeader />
        <UserTokenAccountHelp />
      </TokenAccountInner>
    </TokenAccountOuter>
  );
};
