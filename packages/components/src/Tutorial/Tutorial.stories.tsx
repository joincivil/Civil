import { storiesOf } from "@storybook/react";
import * as React from "react";
import { TutorialInfo } from "./TutorialInfo";
// import { TutorialQuestion } from "./TutorialQuestion";
import { TutorialTopicIntro } from "./TutorialTopicIntro";
import { TutorialTopicCompleted } from "./TutorialTopicCompleted";

export const TopicTutorial: React.SFC = props => (
  <>
    <h2>What is Civil?</h2>
    <p>
      Civil is a decentralized network for trustworthy and sustainable journalism. It is founded on the principle that a
      free press is essential to a fair and just society.
    </p>
    <p>
      Our community-run model providing members a say and share in the project's operations and long-term evolution.
    </p>
    <p>
      More than 125 journalists representing 18 independent newsrooms, from Chicago to Singapore, are already part of
      the Civil community. And we're just getting started!
    </p>
  </>
);

const tutorial = {
  tutorialTopicIntroHeader: "Topic 1: How to use Civil tokens",
  tutorialTopicIntroInfo: "You’ll learn: What is Civil, and what makes us different?",
  tutorialContent: <TopicTutorial />,
  quizName: "Quiz: Considerations before buying tokens",
  question: "Which of the following is important to you when purchasing a token?",
  optionText: "Network value of a token",
  completedHeader: "Nice! You’ve completed Topic 1",
  completedText:
    "Buying tokens, like any financial decision, is a risk. The price of tokens can fluctuate depending on various factors. It’ a good rule of thumb to look at the team behind the token – the founders, the advisors – as well as the token design and its supply.  It’s also important to diversify your portfolio across many investment vehicles – crypto assets and non-crypto assets.",
};

storiesOf("Tutorial", module)
  .add("Tutorial Info", () => {
    return <TutorialInfo content={tutorial.tutorialContent} activeSlide={1} totalSlides={3} />;
  })
  /*.add("Tutorial Question", () => {
    return (
      <TutorialQuestion quizName={tutorial.quizName} question={tutorial.question} options={tutorial.optionText} activeSlide={1} totalSlides={3} />
    );
  })*/
  .add("Tutorial Topic Intro", () => {
    return (
      <TutorialTopicIntro
        headerText={tutorial.tutorialTopicIntroHeader}
        infoText={tutorial.tutorialTopicIntroInfo}
        activeSlide={0}
        totalSlides={0}
      />
    );
  })
  .add("Tutorial Topic Completed", () => {
    return <TutorialTopicCompleted completedHeader={tutorial.completedHeader} completedText={tutorial.completedText} />;
  });
