import * as React from "react";
import {
  TokenAccountOuter,
  TokenAccountInner,
  FlexColumns,
  FlexColumnsPrimary,
  FlexColumnsPrimaryModule,
  FlexColumnsSecondary,
  TokenHeader,
} from "./TokensStyledComponents";
import { TokenWelcomeHeaderText, TokenBuySellHeaderText } from "./TokensTextComponents";
import { UserTokenAccountSignup } from "./TokensAccountSignup";
import { UserTokenAccountBuy } from "./TokensAccountBuy";
import { UserTokenAccountHelp } from "./TokensAccountHelp";
import { UserTokenAccountProgress } from "./TokensAccountProgress";
import { UserTokenAccountFaq } from "./TokensAccountFaq";
import { getFormattedEthAddress, isBrowserCompatible } from "@joincivil/utils";
import { UserTokenAccountPaypal } from "./TokensAccountPaypal";
import { BrowserCompatible } from "../BrowserCompatible";

export enum TOKEN_PROGRESS {
  ACTIVE = "active",
  COMPLETED = "completed",
  DISABLED = "disabled",
}

export interface UserTokenAccountProps {
  foundationAddress: string;
  network: string;
  user?: any;
  addWalletPath: string;
  signupPath: string;
}

export class UserTokenAccount extends React.Component<UserTokenAccountProps> {
  public render(): JSX.Element | null {
    const { user } = this.props;

    const accountSignupComplete = this.getAccountComplete(user);
    const userAccount = this.getUserAccount(user);

    const loggedInState = accountSignupComplete ? TOKEN_PROGRESS.COMPLETED : TOKEN_PROGRESS.ACTIVE;

    const buyState = accountSignupComplete ? TOKEN_PROGRESS.ACTIVE : TOKEN_PROGRESS.DISABLED;

    return (
      <TokenAccountOuter>
        <TokenAccountInner>
          <TokenHeader>
            {buyState === TOKEN_PROGRESS.ACTIVE ? <TokenBuySellHeaderText /> : <TokenWelcomeHeaderText />}
          </TokenHeader>

          <FlexColumns>
            <FlexColumnsPrimary>
              {!isBrowserCompatible()
                ? this.renderBrowserIncompatible()
                : this.renderTokenSteps(loggedInState, buyState)}

              <UserTokenAccountFaq />
            </FlexColumnsPrimary>

            <FlexColumnsSecondary>
              <UserTokenAccountProgress userAccount={userAccount} logInComplete={accountSignupComplete} />
              <UserTokenAccountPaypal />
              <UserTokenAccountHelp />
            </FlexColumnsSecondary>
          </FlexColumns>
        </TokenAccountInner>
      </TokenAccountOuter>
    );
  }

  private renderBrowserIncompatible = () => {
    return (
      <FlexColumnsPrimaryModule>
        <BrowserCompatible />
      </FlexColumnsPrimaryModule>
    );
  };

  private renderTokenSteps = (loggedInState: any, buyState: any) => {
    return (
      <>
        <UserTokenAccountSignup
          user={this.props.user}
          step={loggedInState}
          addWalletPath={this.props.addWalletPath}
          signupPath={this.props.signupPath}
        />

        <UserTokenAccountBuy
          step={buyState}
          network={this.props.network}
          foundationAddress={this.props.foundationAddress}
        />
      </>
    );
  };

  private getAccountComplete = (user: any) => {
    if (user && user.ethAddress) {
      return true;
    }

    return false;
  };

  private getUserAccount = (user: any) => {
    if (user && user.ethAddress) {
      return getFormattedEthAddress(user.ethAddress);
    }

    return "";
  };
}
