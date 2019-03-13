import * as React from "react";
import {
  LoadUser,
  OBSectionHeader,
  OBSectionDescription,
  fonts,
  CivilTutorialIcon,
  TokenBtns,
} from "@joincivil/components";
import { TutorialModal } from "./TutorialModal";
import styled from "styled-components";

const TutorialSectionStyled = styled.div`
  font-family: ${fonts.SANS_SERIF}
  padding-left: 60px;
  position: relative;

  h2 {
    font-size: 20px;
    font-weight: bold;
    line-height: 1;
  }

  p {
    color: #23282D;
    font-size: 14px;
    line-height: 20px;
  }
`;

const IconStyled = styled.div`
  border: 1px solid #d8d8d8;
  border-radius: 50%;
  left: 0;
  padding: 8px;
  position: absolute;
  top: 0;
`;

export class TutorialPage extends React.Component {
  public render(): JSX.Element {
    return (
      <>
        <OBSectionHeader>Take the Civil Tutorial</OBSectionHeader>
        <OBSectionDescription>
          Before you can use Civil tokens, you must complete a tutorial to ensure you understand how to use Civil tokens
          and how the Registry works.
        </OBSectionDescription>
        <TutorialSectionStyled>
          <IconStyled>
            <CivilTutorialIcon />
          </IconStyled>
          <h2>Civil Tutorial</h2>
          <p>
            You’ll be completing a completing a series of questions about Civil and how to use Civil tokens (CVL). This
            is a standard procedure to help inform you of best practices with purchasing and using tokens.
          </p>
          <p>
            It will take about 30 minutes to complete. If at any point you answer incorrectly, don’t worry. You will be
            able to answer the questions again.
          </p>
          <LoadUser>
            {({ loading, user }) => {
              if (loading) {
                return <TokenBtns disabled={true}>Open the Tutorial</TokenBtns>;
              }

              return <TutorialModal user={user} />;
            }}
          </LoadUser>
        </TutorialSectionStyled>
      </>
    );
  }
}
