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

export interface TokenAccountVerify extends FullScreenModalProps {
  step?: string;
  handleClose(): void;
  handleOpen(): void;
}

export const UserTokenAccountVerify: React.StatelessComponent<TokenAccountVerify> = props => {
  let quizSection;
  if (props.step === "disabled") {
    quizSection = (
      <UserTokenAccountRequirement step={props.step}>
        <TokenRequirementIcon step={props.step}>
          <CivilTutorialIcon color={colors.accent.CIVIL_GRAY_3} />
        </TokenRequirementIcon>
        <TokenQuizSectionText />
      </UserTokenAccountRequirement>
    );
  } else {
    quizSection = (
      <UserTokenAccountRequirement step={props.step}>
        <TokenRequirementIcon step={props.step}>
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
          <TokenTutorial />
        </FullScreenModal>
      </UserTokenAccountRequirement>
    );
  }

  return (
    <FlexColumnsPrimaryModule padding={true}>
      <TokenAccountSectionHeader>
        <TokenVerifySectionText />
      </TokenAccountSectionHeader>
      {quizSection}
    </FlexColumnsPrimaryModule>
  );
};
