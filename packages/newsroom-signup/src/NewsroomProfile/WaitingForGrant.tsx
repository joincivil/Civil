import * as React from "react";
import styled from "styled-components";
import {
  colors,
  HollowGreenCheck,
  OBSectionHeader,
  OBSectionDescription,
  OBSmallParagraph,
  OBNoteHeading,
  grantSubmittedImgUrl,
  ReviewIcon,
} from "@joincivil/components";

const Wrapper = styled.div`
  margin: auto;
  max-width: 700px;
  text-align: center;
`;
const ReviewNotice = styled(OBNoteHeading)`
  color: ${colors.accent.CIVIL_BLUE_FADED};
  display: block;
  margin: -36px 0 48px;
`;
const ReviewNoticeMark = styled(ReviewIcon)`
  margin-right: 4px;
  position: relative;
  top: 2px;
  vertical-align: bottom;
`;

const HeadingCheck = styled(HollowGreenCheck)`
  margin-right: 5px;
  vertical-align: bottom;
`;

const GrantSubmittedImageWrap = styled.div`
  margin-bottom: -6px;
`;
const GrantSubmittedImage = styled.img`
  width: 82px;
  height: 82px;
`;

const MainText = styled(OBSectionDescription)`
  padding: 0 36px;
`;
const AddendaText = styled(OBSmallParagraph)`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  margin-top: 42px;
  padding: 36px 36px 0 36px;
`;

export class WaitingForGrant extends React.Component {
  public render(): JSX.Element {
    return (
      <Wrapper>
        <ReviewNotice>
          <ReviewNoticeMark />
          Newsroom Registry Profile in Grant Review
        </ReviewNotice>

        <GrantSubmittedImageWrap>
          <GrantSubmittedImage src={grantSubmittedImgUrl} />
        </GrantSubmittedImageWrap>
        <OBSectionHeader style={{ marginBottom: 24 }}>
          <HeadingCheck width={32} height={32} />
          Grant Request Submitted
        </OBSectionHeader>

        <MainText>
          Your Registry Profile has been submitted to the Civil Foundation team and is now being reviewed for an ETH and
          Civil Token Grant. We will be sending an email with next steps.
        </MainText>
        <MainText>
          You can come back to this page at any time to check in on the status of your grant application.
        </MainText>

        <AddendaText>
          After that there's three more steps before your Registry Application is complete —{" "}
          <a
            href="https://cvlconsensys.zendesk.com/hc/en-us/articles/360016463832-What-is-a-newsroom-smart-contract-"
            target="_blank"
          >
            Newsroom Smart Contract
          </a>,{" "}
          <a
            href="https://cvlconsensys.zendesk.com/hc/en-us/articles/360021949732-What-is-the-Civil-Tutorial-"
            target="_blank"
          >
            Civil Tutorial
          </a>{" "}
          and{" "}
          <a
            href="https://cvlconsensys.zendesk.com/hc/en-us/articles/360024542352-Why-do-I-need-to-apply-with-Civil-tokens-"
            target="_blank"
          >
            Application Deposit
          </a>. While you wait for the Grant request to be reviewed, we suggest you review these materials to
          familiarize yourself with the Civil ecosystem. The Civil Tutorial is a brief series of questions to ensure you
          know how tokens work and how to use the Registry.
        </AddendaText>
        <AddendaText>
          <a
            href="https://cvlconsensys.zendesk.com/hc/en-us/articles/360021942132-Civil-Foundation-Token-Grant"
            target="_blank"
          >
            Learn more
          </a>{" "}
          about the grant process and if you have any questions, contact{" "}
          <a href="mailto:support@civil.co" target="_blank">
            support
          </a>.
        </AddendaText>
      </Wrapper>
    );
  }
}
