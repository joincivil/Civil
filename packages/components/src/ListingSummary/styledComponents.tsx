import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { SectionHeading } from "../Heading";
import { colors, fonts, mediaQueries } from "../styleConstants";
import { InvertedButton } from "../Button";
import { StyledBaseStatus } from "../ApplicationPhaseStatusLabels";

export const StyledListingSummaryList = styled.div`
  display: flex
  flex-wrap: wrap;
  margin: 0 auto;
  width: 1200px;

  ${mediaQueries.MOBILE} {
    display: block;
    width: auto;
  }
`;

export const StyledListingSummaryContainer = styled.div`
  margin: 0 30px 48px 0;
  width: 379px;

  &:nth-child(3n + 3) {
    margin-right: 0;
  }

  ${mediaQueries.MOBILE} {
    width: auto;
    margin: 0 16px 31px;

    &:nth-child(3n + 3) {
      margin-right: 16px;
    }
  }
`;

export interface StyledListingSummaryProps {
  hasTopPadding?: boolean;
}

export const StyledListingSummary: StyledComponentClass<StyledListingSummaryProps, "div"> = styled<
  StyledListingSummaryProps,
  "div"
>("div")`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  box-shadow: inset 0 1px 0 0 ${colors.accent.CIVIL_GRAY_4}, 0 2px 4px 0 ${colors.accent.CIVIL_GRAY_3};
  box-sizing: border-box;
  ${(props: StyledListingSummaryProps) => (props.hasTopPadding ? "padding-top: 25px;" : "")};

  & ${StyledBaseStatus} {
    margin: 10px 22px 10px;
  }
`;

export const StyledListingSummaryTop = styled.div`
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  display: flex;
  padding: 0 22px 25px;
`;

export const StyledBaseResultsBanner = styled.div`
  align-items: center;
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  color: ${colors.primary.BLACK};
  display: flex;
  font-size: 14px;
  justify-content: center;
  line-height: 18px;
  padding: 22px 0;
  margin-bottom: 22px;

  & svg {
    margin-right: 4px;
  }
`;

export const StyledUnderChallengeBanner = styled(StyledBaseResultsBanner)`
  background-color: ${colors.primary.BLACK};
  color: ${colors.basic.WHITE};
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.93px;
  line-height: 15px;
  padding: 11px 0 8px;
  margin-bottom: 12px;
  text-transform: uppercase;
`;

export const StyledNotGrantedResultsBanner = styled(StyledBaseResultsBanner)`
  background-color: ${colors.basic.WHITE};
`;

export const StyledRejectedResultsBanner = styled(StyledBaseResultsBanner)`
  background-color: ${colors.accent.CIVIL_RED_VERY_FADED};
`;

export const StyledAppealJudgementContainer = styled.div`
  align-items: center;
  display: flex;
  background: ${colors.primary.BLACK};
  border-radius: 3px;
  color: ${colors.basic.WHITE};
  font-size: 14px;
  justify-content: center;
  line-height: 18px;
  margin: 9px 8px 2px;
  padding: 15px 0;

  & svg {
    margin-right: 4px;
  }
`;

export const StyledListingSummarySection = styled.div`
  background-color: ${colors.accent.CIVIL_BLUE_FADED_2};
  color: ${colors.primary.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  padding: 25px 22px 50px;

  & ${InvertedButton} {
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 1px;
    line-height: 14px;
    padding: 14px 0;
    text-transform: none;
    text-align: center;
    width: 100%;
  }
`;

export const StyledListingSummaryNewsroomName = styled(SectionHeading)`
  line-height: 26px;
  margin: 0 0 8px;
`;

export const StyledListingSummaryDescription = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font: 400 14px/20px ${fonts.SANS_SERIF};
`;

export const StyledListingChallengeOrAppealStatement = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 16px;
  line-height: 26px;
  margin: 0 0 19px;
`;

export const ChallengeResultsContain = styled.div`
  font-family: ${fonts.SANS_SERIF};
  padding: 25px 22px 50px;
`;

export const NewsroomIcon = styled.figure`
  background: ${colors.accent.CIVIL_GRAY_4};
  height: 80px;
  margin: 0 17px 0 0;
  min-width: 80px;
`;

export const NewsroomLogo = styled.img`
  width: 80px;
  height: 80px;
  min-width: 80px;
  min-height: 80px;
  object-fit: contain;
  background: ${colors.basic.WHITE};
`;

export const SmallNewsroomLogo = styled.img`
  width: 52px;
  height: 52px;
  min-width: 52px;
  min-height: 52px;
  object-fit: contain;
  background: ${colors.basic.WHITE};
`;

export const MetaRow = styled.div`
  margin: 16px 0;
`;

export const TimestampLabel = styled.div`
  font-size: 16px;
  line-height: 16px;
`;

export const TimestampValue = styled.div`
  color: ${colors.primary.CIVIL_GRAY_2};
  font-size: 14px;
  line-height: 17px;
  margin-bottom: 4px;
`;

export const MetaItemValue = styled.div`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-size: 16px;
  line-height: 19px;
`;

export const MetaItemLabel = styled.div`
  color: ${colors.primary.CIVIL_GRAY_2};
  font-size: 12px;
  font-weight: bold;
  line-height: 15px;
  margin-bottom: 5px;
  text-transform: uppercase;
`;

export const StyledChallengeResultsHeader = styled.h4`
  color: ${colors.accent.CIVIL_GRAY_0};
  font-size: 16px;
  line-height: 19px;
  margin: 0 0 6px;
`;
