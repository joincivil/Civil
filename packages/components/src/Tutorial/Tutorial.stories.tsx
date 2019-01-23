import { storiesOf } from "@storybook/react";
import * as React from "react";
import { TutorialInfo } from "./TutorialInfo";
import { TutorialQuestion } from "./TutorialQuestion";
import { TutorialTopicIntro } from "./TutorialTopicIntro";
import { TutorialTopicCompleted } from "./TutorialTopicCompleted";

storiesOf("Tutorial", module)
  .add("Tutorial Info", () => {
    return <TutorialInfo />;
  })
  .add("Tutorial Question", () => {
    return <TutorialQuestion />;
  })
  .add("Tutorial Topic Intro", () => {
    return <TutorialTopicIntro />;
  })
  .add("Tutorial Topic Completed", () => {
    return <TutorialTopicCompleted />;
  });
