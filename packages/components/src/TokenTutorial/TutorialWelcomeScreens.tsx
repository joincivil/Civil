import * as React from "react";
import { WelcomeSlide, WelcomeSlideBtns } from "./TokenTutorialStyledComponents";
import {
  TutorialWelcomeScreen1Text,
  TutorialWelcomeScreen2Text,
  TutorialWelcomeScreen3Text,
  TutorialWelcomeScreenNextText,
  TutorialWelcomeScreenContinueText,
} from "./TokenTutorialTextComponents";
import { BookreaderIcon } from "../icons/BookreaderIcon";
import { BrainIcon } from "../icons/BrainIcon";
import { ExamIcon } from "../icons/ExamIcon";

export const TutorialWelcomeScreens: React.StatelessComponent = props => {
  return (
    <>
      <WelcomeSlide>
        <BookreaderIcon />
        <TutorialWelcomeScreen1Text />
        <WelcomeSlideBtns>
          <TutorialWelcomeScreenNextText />
        </WelcomeSlideBtns>
      </WelcomeSlide>
      <WelcomeSlide>
        <BrainIcon />
        <TutorialWelcomeScreen2Text />
        <WelcomeSlideBtns>
          <TutorialWelcomeScreenNextText />
        </WelcomeSlideBtns>
      </WelcomeSlide>
      <WelcomeSlide>
        <ExamIcon />
        <TutorialWelcomeScreen3Text />
        <WelcomeSlideBtns>
          <TutorialWelcomeScreenContinueText />
        </WelcomeSlideBtns>
      </WelcomeSlide>
    </>
  );
};
