import * as React from "react";
import { getCurrentUserQuery } from "@joincivil/utils";
import { Query } from "react-apollo";
import { UserTokenAccountRequirement } from "./TokensAccountRequirement";
import {
  FlexColumnsPrimaryModule,
  TokenBtns,
  TokenRequirementIcon,
  TokenAccountSectionHeader,
  CloseBtn,
} from "./TokensStyledComponents";
import { TokenVerifySectionText, TokenQuizSectionText, TokenQuizBtnText } from "./TokensTextComponents";
import { CivilTutorialIcon } from "../icons/CivilTutorialIcon";
import { FullScreenModal, FullScreenModalProps } from "../FullscreenModal";
import { TokenTutorial } from "../TokenTutorial";
import { colors } from "../styleConstants";
import { CloseXIcon } from "../icons";
import { TOKEN_PROGRESS } from "./Tokens";

export interface TokenAccountVerifyProps extends FullScreenModalProps {
  step?: string;
  handleClose(): void;
  handleOpen(): void;
}

export class UserTokenAccountVerify extends React.Component<TokenAccountVerifyProps> {
  public render(): JSX.Element {
    const { step, handleClose, handleOpen, open } = this.props;

    if (step === TOKEN_PROGRESS.DISABLED) {
      return (
        <FlexColumnsPrimaryModule padding={true}>
          <TokenAccountSectionHeader>
            <TokenVerifySectionText />
          </TokenAccountSectionHeader>
          <UserTokenAccountRequirement step={step}>
            <TokenRequirementIcon step={step}>
              <CivilTutorialIcon color={colors.accent.CIVIL_GRAY_3} />
            </TokenRequirementIcon>
            <TokenQuizSectionText />
          </UserTokenAccountRequirement>
        </FlexColumnsPrimaryModule>
      );
    } else if (step === TOKEN_PROGRESS.ACTIVE) {
      return (
        <FlexColumnsPrimaryModule padding={true}>
          <TokenAccountSectionHeader>
            <TokenVerifySectionText />
          </TokenAccountSectionHeader>
          <UserTokenAccountRequirement step={step}>
            <TokenRequirementIcon step={step}>
              <CivilTutorialIcon />
            </TokenRequirementIcon>
            <TokenQuizSectionText />
            <Query query={getCurrentUserQuery}>
              {({ loading, error, data }) => {
                if (loading || error) {
                  return (
                    <TokenBtns onClick={handleOpen}>
                      <TokenQuizBtnText />
                    </TokenBtns>
                  );
                }

                const quizPayload = loading || error ? {} : data.currentUser.quizPayload;

                return (
                  <TokenBtns onClick={handleOpen}>
                    {this.isQuizStarted(quizPayload) ? "Continue" : <TokenQuizBtnText />}
                  </TokenBtns>
                );
              }}
            </Query>
            <FullScreenModal open={open || false} solidBackground={true}>
              <CloseBtn onClick={handleClose}>
                <CloseXIcon color={colors.accent.CIVIL_GRAY_2} />
              </CloseBtn>
              <TokenTutorial handleClose={handleClose} />
            </FullScreenModal>
          </UserTokenAccountRequirement>
        </FlexColumnsPrimaryModule>
      );
    }

    return <></>;
  }

  private isQuizStarted = (quizPayload: {}) => {
    if (Object.keys(quizPayload).length > 0) {
      return true;
    }
    return false;
  };
}
