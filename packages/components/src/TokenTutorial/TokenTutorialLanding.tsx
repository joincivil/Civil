import * as React from "react";
import {
  TutorialIntro,
  TutorialTime,
  TutorialSkipSection,
  TakeQuizBtns,
  TutorialTopic,
  LaunchTopic,
} from "./TokenTutorialStyledComponents";
import { ClockIcon } from "../icons/ClockIcon";
import {
  TutorialIntroText,
  TutorialTimeText,
  TutorialSkipText,
  TutorialSkipBtnText,
  TutorialTopic1Text,
  TutorialTopic2Text,
  TutorialTopic3Text,
} from "./TokenTutorialTextComponents";

export const TokenTutorialLanding: React.StatelessComponent = props => {
  return (
    <>
      <TutorialIntro>
        <TutorialIntroText />
        <TutorialTime>
          <ClockIcon />
          <TutorialTimeText />
        </TutorialTime>
      </TutorialIntro>
      <TutorialSkipSection>
        <TutorialSkipText />
        <TakeQuizBtns>
          <TutorialSkipBtnText />
        </TakeQuizBtns>
      </TutorialSkipSection>
      <TutorialTopic>
        <LaunchTopic>
          <TutorialTopic1Text />
        </LaunchTopic>
      </TutorialTopic>
      <TutorialTopic>
        <LaunchTopic>
          <TutorialTopic2Text />
        </LaunchTopic>
      </TutorialTopic>
      <TutorialTopic>
        <LaunchTopic>
          <TutorialTopic3Text />
        </LaunchTopic>
      </TutorialTopic>
    </>
  );
};
