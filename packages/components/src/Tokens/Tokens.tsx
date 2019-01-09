import * as React from "react";
import {
  TokenAccountOuter,
  TokenAccountInner,
  FlexColumns,
  FlexColumnsPrimary,
  FlexColumnsPrimaryModule,
  FlexColumnsSecondary,
  FlexColumnsSecondaryModule,
} from "./TokensStyledComponents";
import { UserTokenAccountHeader } from "./TokensAccountHeader";
import { UserTokenAccountRequirements } from "./TokensAccountRequirements";
import { UserTokenAccountHelp } from "./TokensAccountHelp";

export const UserTokenAccount: React.StatelessComponent = props => {
  return (
    <TokenAccountOuter>
      <TokenAccountInner>
        <UserTokenAccountHeader />
        <FlexColumns>
          <FlexColumnsPrimary>
            <FlexColumnsPrimaryModule>
              <UserTokenAccountRequirements />
            </FlexColumnsPrimaryModule>
          </FlexColumnsPrimary>
          <FlexColumnsSecondary>
            <FlexColumnsSecondaryModule>
              <UserTokenAccountHelp />
            </FlexColumnsSecondaryModule>
          </FlexColumnsSecondary>
        </FlexColumns>
      </TokenAccountInner>
    </TokenAccountOuter>
  );
};
