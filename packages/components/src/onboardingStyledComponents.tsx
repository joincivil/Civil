// tslint:disable-next-line:no-unused-variable
import * as React from "react"; // needed to export styled components
import { colors, fonts } from "./";
import { Collapsable, CollapsableProps } from "./Collapsable";
import { Notice, NoticeTypes } from "./Notice";
import styled, { StyledComponentClass } from "styled-components";

export const OBSectionTitle = styled.h2`
  font-family: ${fonts.SANS_SERIF};
  font-size: 28px;
  font-weight: bold;
  letter-spacing: -0.58px;
  line-height: 30px;
  margin: 24px 0;
  text-align: center;
  color: ${colors.primary.BLACK};
`;

export const OBSectionHeader = styled.h2`
  font-family: ${fonts.SANS_SERIF};
  font-size: 24px;
  font-weight: bold;
  letter-spacing: -0.17px;
  line-height: 30px;
  text-align: center;
`;

export const OBSectionDescription = styled.p`
  font-family: ${fonts.SANS_SERIF};
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: ${colors.primary.CIVIL_GRAY_1};
`;

export const OBSmallParagraph = styled.p`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  line-height: 24px;
`;
export const OBSmallestParagraph = styled(OBSmallParagraph)`
  font-size: 12px;
  line-height: 22px;
`;

export const OBCollapsable: StyledComponentClass<CollapsableProps, any> = styled(Collapsable)`
  text-align: left;
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  margin: 25px 0;
  padding: 17px 7px 17px 0;

  & + & {
    border-top: none;
    margin-top: -25px;
  }
`;
export const OBCollapsableHeader = styled.h4`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  font-weight: bold;
  line-height: 32px;
  margin: 0;
`;

export const OBBorderedSection = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-radius: 7px;
  padding: 32px;
`;
export const OBBorderedSectionActive = styled(OBBorderedSection)`
  border-color: ${colors.accent.CIVIL_BLUE_VERY_FADED};
`;

export const OBNoteContainer = styled(OBBorderedSection)`
  display: flex;
  justify-content: space-between;
  padding-bottom: 30px;
  margin-bottom: 36px;
  text-align: left;
`;
export const OBNoteHeading = styled.span`
  font-weight: 600;
  color: ${colors.accent.CIVIL_GRAY_0};
  font-family: ${fonts.SANS_SERIF};
  font-size: 13px;
  line-height: 16px;
`;
export const OBNoteText = styled.span`
  color: ${colors.accent.CIVIL_GRAY_2};
  font-family: ${fonts.SANS_SERIF};
  font-size: 13px;
  line-height: 16px;
`;

const PreRegNotice = styled(Notice)`
  font-size: 12px;
  line-height: 18px;
  padding: 15px;
  margin: -24px 0 36px;
`;
export const OBPreRegNotice: React.SFC<{ className?: string }> = ({ className }) => (
  <PreRegNotice className={className} type={NoticeTypes.ALERT}>
    Pre-registration is now open for the first stage of the application. This should take about 10 minutes to complete.
    The second and final stage of the process will be available soon.
  </PreRegNotice>
);
