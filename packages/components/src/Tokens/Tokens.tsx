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
  userAccount: string;
  userTutorialComplete: boolean;
  user?: any;
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
    const { user } = this.props;
    const accountSignupStep = this.getUserStep(user);

    const loggedInState = accountSignupStep ? TOKEN_PROGRESS.COMPLETED : TOKEN_PROGRESS.ACTIVE;
    const tutorialState = this.props.userTutorialComplete ? TOKEN_PROGRESS.COMPLETED : TOKEN_PROGRESS.ACTIVE;

    // TODO:Sarah - commented out for testing
    // const buyState =
    //  accountSignupStep && this.props.userTutorialComplete ? TOKEN_PROGRESS.ACTIVE : TOKEN_PROGRESS.DISABLED;

    return (
      <TokenAccountOuter>
        <TokenAccountInner>
          <UserTokenAccountHeader />

          <FlexColumns>
            <FlexColumnsPrimary>
              <UserTokenAccountSignup step={loggedInState} />
              <UserTokenAccountVerify
                step={tutorialState}
                open={this.state.isTutorialModalOpen}
                handleClose={this.closeTutorialModal}
                handleOpen={this.openTutorialModal}
              />
              <UserTokenAccountBuy
                step={"active"}
                network={this.props.network}
                foundationAddress={this.props.foundationAddress}
                faqUrl={this.props.faqUrl}
              />
              <UserTokenAccountFaq />
            </FlexColumnsPrimary>

            <FlexColumnsSecondary>
              <UserTokenAccountProgress
                userAccount={this.props.userAccount}
                logInComplete={accountSignupStep}
                tutorialComplete={this.props.userTutorialComplete}
              />
              <UserTokenAccountHelp supportEmailAddress={this.props.supportEmailAddress} faqUrl={this.props.faqUrl} />
            </FlexColumnsSecondary>
          </FlexColumns>
        </TokenAccountInner>
      </TokenAccountOuter>
    );
  }

  private getUserStep = (user: any) => {
    if (user && user.ethAddress) {
      return true;
    }

    return false;
  };

  private openTutorialModal = () => {
    this.setState({ isTutorialModalOpen: true });
  };

  private closeTutorialModal = () => {
    this.setState({ isTutorialModalOpen: false });
  };
}
