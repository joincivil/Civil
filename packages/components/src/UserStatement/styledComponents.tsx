import * as React from "react";
import styled from "styled-components";
import { CancelButton } from "../Button";

import { colors, fonts, mediaQueries } from "../styleConstants";

export const StyledUserStatementHeaderOuter = styled.div`
  background: ${colors.primary.BLACK};
  display: flex;
  justify-content: center;
  padding: 67px 0 0;
  margin: 0 0 52px;
  width: 100%;
`;

export const StyledUserStatementHeader = styled.div`
  background: ${colors.accent.CIVIL_YELLOW};
  box-sizing: content-box;
  font-family: ${fonts.SANS_SERIF};
  padding: 36px 123px;
  max-width: 675px;
  ${mediaQueries.MOBILE} {
    padding-right: 10px;
    padding-left: 10px;
  }
`;

export const StatementHeaderHeading = styled.h2`
  color: ${colors.primary.BLACK};
  font-family: ${fonts.SERIF};
  font-size: 32px;
  line-height: 40px;
  margin: 0 0 23px;
`;

export const StatementHeaderNewsroomName = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 24px;
  line-height: 29px;
  margin: 0 0 11px;
`;

export const CopyLarge = styled.p`
  font: normal 18px/33px ${fonts.SANS_SERIF};
  margin: 0 0 24px;
`;

export const StyledLi = styled.li`
  font-size: 21px;
  line-height: 25px;
  padding: 0;
  margin: 0 0 17px;
`;

export const StyledLiContent = styled.span`
  font-size: 18px;
  line-height: 33px;
`;

export const StyledOl = styled.ol`
  margin: 13px 0 21px;
  padding: 0 0 0 39px;
`;

export const CopySmall = styled.p`
  font-size: 14px;
  line-height: 20px;
  margin: 0 0 30px;
`;

export const StyledLink = styled.a`
  border-bottom: 1px solid transparent;
  color: ${colors.accent.CIVIL_BLUE};
  text-decoration: none;

  &:hover {
    border-bottom-color: ${colors.accent.CIVIL_BLUE};
  }
`;

export const StyledUserStatementBodyOuter = styled.div`
  display: flex;
  justify-content: center;
  ${mediaQueries.MOBILE} {
    margin-right: 10px;
    margin-left: 10px;
  }
`;

export const StyledUserStatementBody = styled.div`
  font-family: ${fonts.SANS_SERIF};
  width: 675px;
`;

export const BodyHeader = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 24px;
  font-weight: bold;
  letter-spacing: -0.12px;
  margin: 0 0 9px;
  line-height: 33px;
`;

export const BodyCopyHelper = styled.div`
  color: ${colors.primary.CIVIL_GRAY_2};
  font-size: 14px;
  margin: 0 0 9px;
  line-height: 20px;
`;

export const SectionForm = styled.div`
  margin: 32px 0;
`;

export const SectionFormHeader = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 18px;
  letter-spacing: -0.1px;
  line-height: 21px;
  margin: 0 0 12px;
`;

export const SectionFormCopyHelper = styled.div`
  color: ${colors.primary.CIVIL_GRAY_2};
  font-size: 14px;
  letter-spacing: -0.1px;
  line-height: 17px;
  margin: 0 0 5px;
`;

export const StyledTextareaContainer = styled.div`
  min-height: 110px;

  & textarea,
  & .public-DraftEditor-content {
    min-height: 110px;
  }
`;

export const SectionDeposit = styled.div`
  box-shadow: inset 0 -1px 0 0 ${colors.accent.CIVIL_GRAY_4};
  display: flex;
  justify-content: space-between;
  padding: 26px;
`;

export const StyledDepositLabel = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 18px;
  font-weight: bold;
  letter-spacing: -0.1px;
  line-height: 21px;
`;

export const StyledDepositAmount = styled(StyledDepositLabel)`
  text-align: right;
`;

export const SectionActions = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  padding: 50px 0 120px;

  ${CancelButton} {
    font-size: 13px;
    line-height: 14px;
    margin: 6px 27px 0 0;
    text-transform: none;
  }

  & ${SectionFormCopyHelper} {
    margin-top: 18px;
    max-width: 305px;
    text-align: left;
  }
`;

export const SectionConfirmChallenge = styled.div`
  display: flex;
  font-size: 15px;
  letter-spacing: -0.1px;
  line-height: 26px;
  padding: 32px 0 0;
  margin: 0 0 56px;

  & > div + div {
    margin: -8px 0 0 12px;
  }
  ${mediaQueries.MOBILE} {
    padding-right: 10px;
    padding-left: 10px;
  }
`;

export const StyledErrorMessage = styled.span`
  color: ${colors.accent.CIVIL_RED};
`;

export const PullRight = styled.div`
  text-align: right;
`;
