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
import { UserTokenAccountSignup } from "./TokensAccountSignup";
import { UserTokenAccountVerify } from "./TokensAccountVerify";
import { UserTokenAccountBuy } from "./TokensAccountBuy";
import { UserTokenAccountHelp } from "./TokensAccountHelp";

export const UserTokenAccount: React.StatelessComponent = props => {
  return (
    <TokenAccountOuter>
      <TokenAccountInner>
        <UserTokenAccountHeader />
        <FlexColumns>
          <FlexColumnsPrimary>
            <FlexColumnsPrimaryModule>
              <UserTokenAccountSignup step={"completed"} />
            </FlexColumnsPrimaryModule>
            <FlexColumnsPrimaryModule>
              <UserTokenAccountVerify step={"active"} open={false} />
            </FlexColumnsPrimaryModule>
            <FlexColumnsPrimaryModule>
              <UserTokenAccountBuy />
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
