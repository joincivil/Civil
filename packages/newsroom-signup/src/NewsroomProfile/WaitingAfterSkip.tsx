import * as React from "react";
import styled from "styled-components";
import {
  colors,
  OBSectionHeader,
  OBSectionDescription,
  OBSmallParagraph,
  OBNoteHeading,
  applicationSavedImgUrl,
} from "@joincivil/components";

const Wrapper = styled.div`
  margin: auto;
  max-width: 700px;
  text-align: center;
`;

const ApplicationSavedImageWrap = styled.div`
  margin-bottom: -6px;
`;
const ApplicationSavedImage = styled.img`
  width: 82px;
  height: 82px;
`;

const MainText = styled(OBSectionDescription)`
  padding: 0 36px;
`;
const AddendaLink = styled(OBNoteHeading)`
  color: ${colors.accent.CIVIL_BLUE_FADED};
  display: block;
  margin: 48px 0;
`;
const AddendaText = styled(OBSmallParagraph)`
  && {
    margin: 96px 0 60px;
  }
`;

export class WaitingAfterSkip extends React.Component {
  public render(): JSX.Element {
    return (
      <Wrapper>
        <ApplicationSavedImageWrap>
          <ApplicationSavedImage src={applicationSavedImgUrl} />
        </ApplicationSavedImageWrap>
        <OBSectionHeader style={{ marginBottom: 24 }}>Newsroom Registry Profile Saved</OBSectionHeader>

        <MainText>
          Thank you for completing your Newsroom Registry Profile. You may now continue to create your Newsroom Smart
          Contract and apply to the Civil Registry.
        </MainText>

        <AddendaLink>
          <a
            href="https://cvlconsensys.zendesk.com/hc/en-us/articles/360017687131-What-is-the-Civil-Registry-"
            target="_blank"
          >
            Learn more about the Civil Registry
          </a>
        </AddendaLink>

        <AddendaText>
          If you have any questions, you can contact{" "}
          <a href="mailto:support@civil.co" target="_blank">
            support
          </a>.
        </AddendaText>
      </Wrapper>
    );
  }
}
