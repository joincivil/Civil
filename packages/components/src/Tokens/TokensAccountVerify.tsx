import * as React from "react";
import { UserTokenAccountRequirement } from "./TokensAccountRequirement";
import { TokenBtns, TokenRequirementIcon, TokenAccountSectionHeader } from "./TokensStyledComponents";
import { TokenVerifySectionText, TokenQuizSectionText, TokenQuizBtnText } from "./TokensTextComponents";
import { CivilTutorialIcon } from "../icons/CivilTutorialIcon";
import { FullScreenModal } from "../FullscreenModal";
import { TokenTutorial } from "../TokenTutorial";
import { colors } from "../styleConstants";

export interface TokenAccountVerify {
  step?: string;
  open?: boolean;
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
        <TokenBtns>
          <TokenQuizBtnText />
        </TokenBtns>
        <FullScreenModal open={props.open || false} solidBackground={true}>
          <TokenTutorial />
        </FullScreenModal>
      </UserTokenAccountRequirement>
    );
  }

  return (
    <>
      <TokenAccountSectionHeader>
        <TokenVerifySectionText />
      </TokenAccountSectionHeader>
      {quizSection}
    </>
  );
};
