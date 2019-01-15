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
