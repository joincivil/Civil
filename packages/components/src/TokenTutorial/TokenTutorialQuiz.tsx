import * as React from "react";
import { TutorialContent } from "./TutorialContent";
import { TutorialTopicIntro } from "../Tutorial/TutorialTopicIntro";
import { TutorialInfo } from "../Tutorial/TutorialInfo";
import { TutorialQuestion } from "../Tutorial/TutorialQuestion";
import { TutorialTopicCompleted } from "../Tutorial/TutorialTopicCompleted";
import { TutorialContain } from "./TokenTutorialStyledComponents";

export interface TokenTutorialQuizProps {
  quizId?: number;
  slideIdx?: number;
}

export class TokenTutorialQuiz extends React.Component<TokenTutorialQuizProps> {
  public render(): JSX.Element {
    const quizId = this.props.quizId || 0;
    const slideIdx = 0;

    return (
      <TutorialContain>
        <TutorialTopicIntro
          headerText={TutorialContent[quizId].tutorialIntro.header}
          infoText={TutorialContent[quizId].tutorialIntro.content}
        />
        <TutorialInfo content={TutorialContent[quizId].tutorials[slideIdx].content} />
        <TutorialQuestion
          quizName={TutorialContent[quizId].name}
          question={TutorialContent[quizId].questions[slideIdx].question}
          options={TutorialContent[quizId].questions[slideIdx].options}
        />
        <TutorialTopicCompleted
          completedHeader={TutorialContent[quizId].completed.header}
          completedText={TutorialContent[quizId].completed.content}
        />
      </TutorialContain>
    );
  }
}
