import * as React from "react";
import styled from "styled-components";
import {
  colors,
  HollowGreenCheck,
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
const ReviewNotice = styled(OBNoteHeading)`
  color: ${colors.accent.CIVIL_BLUE_FADED};
  display: block;
  margin: -24px 0 48px;
`;
const NoticeCheck = styled(HollowGreenCheck)`
  margin-right: 4px;
  position: relative;
  top: 2px;
  vertical-align: bottom;
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
        <ReviewNotice>
          <NoticeCheck width={24} height={24} />
          Pre-registration complete
        </ReviewNotice>

        <ApplicationSavedImageWrap>
          <ApplicationSavedImage src={applicationSavedImgUrl} />
        </ApplicationSavedImageWrap>
        <OBSectionHeader style={{ marginBottom: 24 }}>Newsroom Registry Profile Saved</OBSectionHeader>

        <MainText>
          Thank you for completing your Newsroom Registry Profile. We are launching the remainder of application process
          to the Civil Registry soon, and once that's live, you'll need to come back to finish your application.
        </MainText>
        <MainText>
          We'll send you an email once that's ready for you to complete. Note that you can edit your Registry Profile at
          any time.
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
