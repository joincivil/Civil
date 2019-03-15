import * as React from "react";
import {
  TokenAccountOuter,
  TokenAccountInner,
  FlexColumns,
  FlexColumnsPrimary,
  FlexColumnsPrimaryModule,
  FlexColumnsSecondary,
  TokenHeader,
  TokenSection,
} from "./TokensStyledComponents";
import { TokenWelcomeHeaderText, TokenBuySellHeaderText, TokenMustBuyEth } from "./TokensTextComponents";
import { UserTokenAccountSignup } from "./TokensAccountSignup";
import { UserTokenAccountVerify } from "./TokensAccountVerify";
import { UserTokenAccountBuy } from "./TokensAccountBuy";
import { UserTokenAccountHelp } from "./TokensAccountHelp";
import { UserTokenAccountProgress } from "./TokensAccountProgress";
import { UserTokenAccountFaq } from "./TokensAccountFaq";
import { getFormattedEthAddress } from "@joincivil/utils";
import { Notice, NoticeTypes } from "../Notice";
import { UserTokenAccountPaypal } from "./TokensAccountPaypal";
import { BrowserCompatible } from "../BrowserCompatible";

export enum TOKEN_PROGRESS {
  ACTIVE = "active",
  COMPLETED = "completed",
  DISABLED = "disabled",
}

export interface UserTokenAccountProps {
  foundationAddress: string;
  supportEmailAddress: string;
  faqUrl: string;
  network: string;
  user?: any;
  addWalletPath: string;
  signupPath: string;
}

export interface UserTokenAccountStates {
  isTutorialModalOpen: boolean;
  isTutorialComplete: boolean;
}

export class UserTokenAccount extends React.Component<UserTokenAccountProps, UserTokenAccountStates> {
  public constructor(props: UserTokenAccountProps) {
    super(props);
    this.state = {
      isTutorialModalOpen: false,
      isTutorialComplete: false,
    };
  }
  public getTutorialState(loggedInState: TOKEN_PROGRESS, tutorialComplete: boolean): TOKEN_PROGRESS {
    if (loggedInState === TOKEN_PROGRESS.ACTIVE) {
      return TOKEN_PROGRESS.DISABLED;
    }
    if (tutorialComplete) {
      return TOKEN_PROGRESS.COMPLETED;
    }

    return TOKEN_PROGRESS.ACTIVE;
  }

  public render(): JSX.Element | null {
    const { user, addWalletPath, network, foundationAddress, faqUrl, supportEmailAddress, signupPath } = this.props;
    const { isTutorialModalOpen } = this.state;

    const accountSignupComplete = this.getAccountComplete(user);
    const tutorialComplete = this.getTutorialComplete(user);
    const userAccount = this.getUserAccount(user);

    const loggedInState = accountSignupComplete ? TOKEN_PROGRESS.COMPLETED : TOKEN_PROGRESS.ACTIVE;
    const tutorialState = this.getTutorialState(loggedInState, tutorialComplete);

    const buyState = accountSignupComplete && tutorialComplete ? TOKEN_PROGRESS.ACTIVE : TOKEN_PROGRESS.DISABLED;

    return (
      <TokenAccountOuter>
        <TokenAccountInner>
          <TokenHeader>
            {buyState === TOKEN_PROGRESS.ACTIVE ? <TokenBuySellHeaderText /> : <TokenWelcomeHeaderText />}
          </TokenHeader>

          <FlexColumns>
            <FlexColumnsPrimary>
              <FlexColumnsPrimaryModule>
                <BrowserCompatible />
              </FlexColumnsPrimaryModule>

              <UserTokenAccountSignup
                user={user}
                step={loggedInState}
                addWalletPath={addWalletPath}
                signupPath={signupPath}
              />

              <UserTokenAccountVerify
                step={tutorialState}
                open={isTutorialModalOpen}
                handleClose={() => this.closeTutorialModal(user)}
                handleOpen={this.openTutorialModal}
              />

              <TokenSection>
                <Notice type={NoticeTypes.INFO}>
                  <TokenMustBuyEth />
                </Notice>
              </TokenSection>

              <UserTokenAccountBuy
                step={buyState}
                network={network}
                foundationAddress={foundationAddress}
                faqUrl={faqUrl}
              />
              <UserTokenAccountFaq />
            </FlexColumnsPrimary>

            <FlexColumnsSecondary>
              <UserTokenAccountProgress
                userAccount={userAccount}
                logInComplete={accountSignupComplete}
                tutorialComplete={tutorialComplete}
              />
              <UserTokenAccountPaypal />
              <UserTokenAccountHelp supportEmailAddress={supportEmailAddress} faqUrl={faqUrl} />
            </FlexColumnsSecondary>
          </FlexColumns>
        </TokenAccountInner>
      </TokenAccountOuter>
    );
  }

  private getAccountComplete = (user: any) => {
    if (user && user.ethAddress) {
      return true;
    }

    return false;
  };

  private getTutorialComplete = (user: any) => {
    if (user && user.quizStatus) {
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

  private openTutorialModal = () => {
    this.setState({ isTutorialModalOpen: true });
  };

  private closeTutorialModal = (user: any) => {
    if (user && user.quizStatus) {
      this.setState({ isTutorialModalOpen: false, isTutorialComplete: true });
    } else {
      this.setState({ isTutorialModalOpen: false });
    }
  };
}
