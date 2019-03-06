import { storiesOf } from "@storybook/react";
import * as React from "react";
import { TutorialInfo } from "./TutorialInfo";
import { TutorialQuestion } from "./TutorialQuestion";
import { TutorialTopicIntro } from "./TutorialTopicIntro";
import { TutorialTopicCompleted } from "./TutorialTopicCompleted";

const TopicTutorial: React.SFC = props => (
  <>
    <h2>What is Civil?</h2>
    <p>
      Civil is a decentralized network for trustworthy and sustainable journalism. It is founded on the principle that a
      free press is essential to a fair and just society.
    </p>
    <p>
      Our community-run model providing members a say and share in the project’s operations and long-term evolution.
    </p>
    <p>
      More than 125 journalists representing 18 independent newsrooms, from Chicago to Singapore, are already part of
      the Civil community. And we’re just getting started!
    </p>
  </>
);

const TopicIntro: React.SFC = props => (
  <>
    <p>
      <b>You’ll learn</b>
    </p>
    <p>What is Civil, and what makes us different?</p>
    <p>How does a Newsroom join the Civil network?</p>
    <p>What are Civil tokens (CVL)?</p>
    <p>What is the Civil Registry?</p>
  </>
);

const onClickFunc = () => {
  console.log("clicked!");
};

const tutorial = {
  tutorialTopicIntroHeader: "Topic 1: How to use Civil tokens",
  tutorialTopicIntroInfo: <TopicIntro />,
  tutorialContent: <TopicTutorial />,
  quizName: "Quiz: Considerations before buying tokens",
  question: "Which of the following is important to you when purchasing a token?",
  options: [{ text: "Option 1" }, { text: "Option 2" }, { text: "Option 3" }],
  answer: "Option 1",
  completedHeader: "Nice! You’ve completed Topic 1",
  completedText:
    "Buying tokens, like any financial decision, is a risk. The price of tokens can fluctuate depending on various factors. It’ a good rule of thumb to look at the team behind the token – the founders, the advisors – as well as the token design and its supply.  It’s also important to diversify your portfolio across many investment vehicles – crypto assets and non-crypto assets.",
  continueBtnText: "Continue to topic 2",
};

storiesOf("Tutorial", module)
  .add("Tutorial Topic Intro", () => {
    return (
      <TutorialTopicIntro
        headerText={tutorial.tutorialTopicIntroHeader}
        infoText={tutorial.tutorialTopicIntroInfo}
        activeSlide={0}
        totalSlides={0}
        onClickNext={onClickFunc}
        onClickSkipTutorial={onClickFunc}
      />
    );
  })
  .add("Tutorial Info", () => {
    return (
      <TutorialInfo
        content={tutorial.tutorialContent}
        activeSlide={1}
        totalSlides={3}
        onClickPrev={onClickFunc}
        onClickNext={onClickFunc}
      />
    );
  })
  .add("Tutorial Question", () => {
    return (
      <TutorialQuestion
        quizId={"topic1"}
        quizName={tutorial.quizName}
        question={tutorial.question}
        answer={tutorial.answer}
        options={tutorial.options}
        activeSlide={1}
        totalSlides={3}
        onClickPrev={onClickFunc}
        onClickNext={onClickFunc}
        checkAnswerDisabled={true}
        usersAnswerValue={""}
        usersAnswerResult={""}
        resetQuestion={0}
      />
    );
  })
  .add("Tutorial Topic Completed", () => {
    return (
      <TutorialTopicCompleted
        completedHeader={tutorial.completedHeader}
        completedText={tutorial.completedText}
        continueBtnText={tutorial.continueBtnText}
        lastTopic={false}
        onClickNextTopic={onClickFunc}
        handleClose={onClickFunc}
      />
    );
  });
