import * as React from "react";
import { TutorialTopicTitle, TutorialTopicInfo, TutorialInvertedBtn, TutorialContentWrap } from "./TutorialStyledComponents";
import { SkipToQuizBtnText } from "./TutorialTextComponents";
import { TutorialFooter } from "./TutorialFooter";
import { TutorialProgress } from "./TutorialProgress";

export interface TutorialTopicIntroProps {
  headerText?: string | JSX.Element;
  infoText?: string | JSX.Element;
}

export const TutorialTopicIntro: React.StatelessComponent<TutorialTopicIntroProps> = props => {
  return (
    <>
      <TutorialProgress />
      <TutorialContentWrap>
        <TutorialTopicTitle>{props.headerText}</TutorialTopicTitle>
        <TutorialTopicInfo>{props.infoText}</TutorialTopicInfo>
        <TutorialInvertedBtn>
          <SkipToQuizBtnText />
        </TutorialInvertedBtn>
      </TutorialContentWrap>
      <TutorialFooter />
    </>
  );
};
