import * as React from "react";
import { TokenQuestionsHeaderText, TokenAskQuestionText, TokenFAQText } from "./TokensTextComponents";
import { Collapsable } from "../Collapsable";

export const UserTokenAccountHelp: React.StatelessComponent = props => {
  return (
    <>
      <Collapsable header={<TokenQuestionsHeaderText />} open={true}>
        <TokenAskQuestionText />
        <TokenFAQText />
      </Collapsable>
    </>
  );
};
