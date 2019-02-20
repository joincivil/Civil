import * as React from "react";
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

export interface TokenAccountVerify extends FullScreenModalProps {
  step?: string;
  handleClose(): void;
  handleOpen(): void;
}

export const UserTokenAccountVerify: React.StatelessComponent<TokenAccountVerify> = props => {
  const { step } = props;

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
          <TokenBtns onClick={props.handleOpen}>
            <TokenQuizBtnText />
          </TokenBtns>
          <FullScreenModal open={props.open || false} solidBackground={true}>
            <CloseBtn onClick={props.handleClose}>
              <CloseXIcon color={colors.accent.CIVIL_GRAY_2} />
            </CloseBtn>
            <TokenTutorial handleClose={props.handleClose} />
          </FullScreenModal>
        </UserTokenAccountRequirement>
      </FlexColumnsPrimaryModule>
    );
  }

  return <></>;
};
