import * as React from "react";
import {
  TutorialTopicTitle,
  TutorialFooter,
  TutorialBtn,
  TutorialInvertedBtn,
  TutorialTopProgress,
  TutorialTopProgressBar,
} from "./TutorialStyledComponents";
import { SkipToQuizBtnText, LetsGoBtnText } from "./TutorialTextComponents";

export interface TutorialTopicIntroPropps {
  tutorialTopicTitle?: string;
}

export const TutorialTopicIntro: React.StatelessComponent<TutorialTopicIntroPropps> = props => {
  return (
    <>
      <TutorialTopProgress>
        <TutorialTopProgressBar />
      </TutorialTopProgress>
      <TutorialTopicTitle>{props.tutorialTopicTitle}</TutorialTopicTitle>
      <TutorialInvertedBtn>
        <SkipToQuizBtnText />
      </TutorialInvertedBtn>
      <TutorialFooter>
        <TutorialBtn>
          <LetsGoBtnText />
        </TutorialBtn>
      </TutorialFooter>
    </>
  );
};
