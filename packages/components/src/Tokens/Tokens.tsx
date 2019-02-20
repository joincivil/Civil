import * as React from "react";
import {
  TokenAccountOuter,
  TokenAccountInner,
  FlexColumns,
  FlexColumnsPrimary,
  FlexColumnsSecondary,
} from "./TokensStyledComponents";
import { UserTokenAccountHeader } from "./TokensAccountHeader";
import { UserTokenAccountSignup } from "./TokensAccountSignup";
import { UserTokenAccountVerify } from "./TokensAccountVerify";
import { UserTokenAccountBuy } from "./TokensAccountBuy";
import { UserTokenAccountHelp } from "./TokensAccountHelp";
import { UserTokenAccountProgress } from "./TokensAccountProgress";
import { UserTokenAccountFaq } from "./TokensAccountFaq";
import { getFormattedEthAddress } from "@joincivil/utils";

export const TOKEN_PROGRESS = {
  ACTIVE: "active",
  COMPLETED: "completed",
  DISABLED: "disabled",
};

export interface UserTokenAccountProps {
  foundationAddress: string;
  supportEmailAddress: string;
  faqUrl: string;
  network: string;
  user?: any;
  addWalletPath: string;
}

export interface UserTokenAccountStates {
  isTutorialModalOpen: boolean;
}

export class UserTokenAccount extends React.Component<UserTokenAccountProps, UserTokenAccountStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      isTutorialModalOpen: false,
    };
  }

  public render(): JSX.Element | null {
    const { user, network, foundationAddress, faqUrl, supportEmailAddress } = this.props;
    const { isTutorialModalOpen } = this.state;

    const accountSignupComplete = this.getAccountComplete(user);
    const tutorialComplete = this.getTutorialComplete(user);
    const userAccount = this.getUserAccount(user);

    const loggedInState = accountSignupComplete ? TOKEN_PROGRESS.COMPLETED : TOKEN_PROGRESS.ACTIVE;
    const tutorialState =
      loggedInState === TOKEN_PROGRESS.ACTIVE
        ? TOKEN_PROGRESS.DISABLED
        : tutorialComplete
          ? TOKEN_PROGRESS.COMPLETED
          : TOKEN_PROGRESS.ACTIVE;
    const buyState = accountSignupComplete && tutorialComplete ? TOKEN_PROGRESS.ACTIVE : TOKEN_PROGRESS.DISABLED;

    return (
      <TokenAccountOuter>
        <TokenAccountInner>
          <UserTokenAccountHeader />

          <FlexColumns>
            <FlexColumnsPrimary>
              <UserTokenAccountSignup step={loggedInState} addWalletPath={addWalletPath} />
              <UserTokenAccountVerify
                step={tutorialState}
                open={isTutorialModalOpen}
                handleClose={this.closeTutorialModal}
                handleOpen={this.openTutorialModal}
              />
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

  private closeTutorialModal = () => {
    this.setState({ isTutorialModalOpen: false });
  };
}
