import * as React from "react";
import {
  TokenAccountOuter,
  TokenAccountInner,
  TokenColumns,
  PrimaryContentColumn,
  SecondaryContentColumn,
} from "./TokensStyledComponents";
import { UserTokenAccountHeader } from "./TokensAccountHeader";
import { UserTokenAccountStages } from "./TokensAccountStages";
import { UserTokenAccountHelp } from "./TokensAccountHelp";

export const UserTokenAccount: React.StatelessComponent = props => {
  return (
    <TokenAccountOuter>
      <TokenAccountInner>
        <UserTokenAccountHeader />
        <TokenColumns>
          <PrimaryContentColumn>
            <UserTokenAccountStages />
          </PrimaryContentColumn>
          <SecondaryContentColumn>
            <UserTokenAccountHelp />
          </SecondaryContentColumn>
        </TokenColumns>
      </TokenAccountInner>
    </TokenAccountOuter>
  );
};
