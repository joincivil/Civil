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

export interface UserTokenAccountProps {
  supportEmailAddress: string;
  faqUrl: string;
  userAccount: string;
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
    return (
      <TokenAccountOuter>
        <TokenAccountInner>
          <UserTokenAccountHeader />

          <FlexColumns>
            <FlexColumnsPrimary>
              <UserTokenAccountSignup step={"completed"} />
              <UserTokenAccountVerify
                step={"active"}
                open={this.state.isTutorialModalOpen}
                handleClose={this.closeTutorialModal}
                handleOpen={this.openTutorialModal}
              />
              <UserTokenAccountBuy openAirSwap={this.openAirSwap} step={"active"} />
            </FlexColumnsPrimary>

            <FlexColumnsSecondary>
              <UserTokenAccountProgress userAccount={this.props.userAccount} />
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

  private openAirSwap = () => {
    this.setState({ isTutorialModalOpen: false });
  };
}
