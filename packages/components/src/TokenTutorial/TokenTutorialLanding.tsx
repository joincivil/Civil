import * as React from "react";
import {
  TutorialIntro,
  TutorialTime,
  TutorialSkipSection,
  TakeQuizBtn,
  TutorialTopic,
  LaunchTopic,
} from "./TokenTutorialStyledComponents";
import { ClockIcon } from "../icons/ClockIcon";
import {
  TutorialIntroText,
  TutorialTimeText,
  TutorialSkipText,
  TutorialSkipBtnText,
} from "./TokenTutorialTextComponents";
import { TutorialContent } from "./TutorialContent";
import { DisclosureArrowIcon } from "../icons/DisclosureArrowIcon";

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
        <TakeQuizBtn>
          <TutorialSkipBtnText />
        </TakeQuizBtn>
      </TutorialSkipSection>
      {TutorialContent.map(topic => (
        <TutorialTopic>
          <LaunchTopic>
            <div>
              {topic.icon}
              <h3>{topic.name}</h3>
              <p>{topic.description}</p>
            </div>
            <DisclosureArrowIcon />
          </LaunchTopic>
        </TutorialTopic>
      ))}
    </>
  );
};
