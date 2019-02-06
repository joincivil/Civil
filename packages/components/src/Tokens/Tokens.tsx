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

export const TOKEN_PROGRESS = {
  ACTIVE: "active",
  COMPLETED: "completed",
  DISABLED: "disabled",
};

export interface UserTokenAccountProps {
  supportEmailAddress: string;
  faqUrl: string;
  userAccount: string;
  userLoggedIn: boolean;
  userTutorialComplete: boolean;
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
    let loggedInState;
    let tutorialState;
    let buyState;

    this.props.userLoggedIn ? (loggedInState = TOKEN_PROGRESS.COMPLETED) : (loggedInState = TOKEN_PROGRESS.ACTIVE);
    this.props.userTutorialComplete
      ? (tutorialState = TOKEN_PROGRESS.COMPLETED)
      : (tutorialState = TOKEN_PROGRESS.ACTIVE);
    this.props.userLoggedIn && this.props.userTutorialComplete
      ? (buyState = TOKEN_PROGRESS.ACTIVE)
      : (buyState = TOKEN_PROGRESS.DISABLED);

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
              <UserTokenAccountBuy step={buyState} />
            </FlexColumnsPrimary>

            <FlexColumnsSecondary>
              <UserTokenAccountProgress
                userAccount={this.props.userAccount}
                logInComplete={this.props.userLoggedIn}
                tutorialComplete={this.props.userTutorialComplete}
              />
              <UserTokenAccountHelp supportEmailAddress={this.props.supportEmailAddress} faqUrl={this.props.faqUrl} />
            </FlexColumnsSecondary>
          </FlexColumns>
        </TokenAccountInner>
      </TokenAccountOuter>
    );
  }

  private openTutorialModal = () => {
    this.setState({ isTutorialModalOpen: true });
  };

  private closeTutorialModal = () => {
    this.setState({ isTutorialModalOpen: false });
  };
}
