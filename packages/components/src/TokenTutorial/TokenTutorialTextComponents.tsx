import * as React from "react";

export const TutorialIntroText: React.SFC = props => (
  <>
    <h2>Choose a topic below to get started</h2>
    <p>First, let’s walk through a topic. Then, answer a few questions at the end of each section.</p>
  </>
);

export const TutorialTimeText: React.SFC = props => <>30 minutes</>;

export const TutorialSkipText: React.SFC = props => (
  <p>
    <b>Skip the walkthrough and take the quiz.</b> If you’ve read our white paper, the Civil Constitution, and FAQ, skip
    to the quiz.
  </p>
);

export const TutorialSkipBtnText: React.SFC = props => <>Take the quiz</>;

export const TutorialTopic1Text: React.SFC = props => (
  <>
    <h3>Topic 1: Considerations before buying tokens</h3>
    <p>Learn about token price trends, token design, and potential risks.</p>
  </>
);

export const TutorialTopic2Text: React.SFC = props => (
  <>
    <h3>Topic 2: Purchasing, storing, and using tokens</h3>
    <p>Learn basic concepts of ETH, gas, digital wallets, keys, and recovery seed phrases.</p>
  </>
);

export const TutorialTopic3Text: React.SFC = props => (
  <>
    <h3>Topic 3: How CVL tokens work</h3>
    <p>Learn about CVL tokens and their intended uses within the Civil network.</p>
  </>
);
