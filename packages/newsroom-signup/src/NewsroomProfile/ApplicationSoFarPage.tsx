import * as React from "react";
import styled from "styled-components";
import {
  fonts,
  colors,
  OBCollapsable,
  OBSectionHeader,
  OBSectionDescription,
  HollowGreenCheck,
} from "@joincivil/components";
import { AvatarWrap, AvatarImg, noAvatar } from "../styledComponents";
import { CharterData, RosterMember } from "@joincivil/core";
import { charterQuestions, questionsCopy } from "../constants";
import { RosterMemberListItem } from "./RosterMemberListItem";

export interface ApplicationSoFarPageProps {
  charter: Partial<CharterData>;
}

const Collapsable = styled(OBCollapsable)`
  &:last-child {
    margin-bottom: 64px;
  }
`;

const SectionHeaders = styled.h4`
  padding-left: 36px;
  margin-bottom: 0;
  font-size: 16px;
  font-weight: bold;
  line-height: 32px;
  font-family: ${fonts.SANS_SERIF};
`;
const SectionHeaderCheck = styled(HollowGreenCheck)`
  position: absolute;
  left: 0;
  top: 3px;
  width: 24px;
  height: 24px;
`;

const Label = styled.div`
  font-family: ${fonts.SANS_SERIF};
  font-size: 12px;
  line-height: 16px;
  color: ${colors.accent.CIVIL_GRAY_2};
`;

const Value = styled.div`
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  letter-spacing: 0.13px;
  line-height: 24px;
  color: ${colors.primary.BLACK};
  word-break: break-word;
`;

const CollapsableInner = styled.div`
  padding: 10px 20px 10px 36px;
`;

const GridWrapper = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 40% 50%;
  grid-template-rows: 70px minmax(70px, auto) auto 70px;
`;

const TwoSpanner = styled.div`
  grid-column: span 2;
`;

const LogoSection = styled.div`
  display: flex;
  justify-content: space-between;
`;

const QuestionContainer = styled.div`
  padding: 20px 0;
  ${Label} {
    margin-bottom: 10px;
  }
`;

export class ApplicationSoFarPage extends React.Component<ApplicationSoFarPageProps> {
  public render(): JSX.Element {
    return (
      <div>
        <OBSectionHeader>Here’s your Registry Profile so far</OBSectionHeader>
        <OBSectionDescription>
          Please review your newsroom Registry Profile. Keep in mind that this is a public document.
        </OBSectionDescription>
        <Collapsable
          open={true}
          header={
            <SectionHeaders>
              <SectionHeaderCheck />
              Newsroom Details
            </SectionHeaders>
          }
        >
          <CollapsableInner>
            <GridWrapper>
              <div>
                <Label>Newsroom Name</Label>
                <Value>{this.props.charter.name}</Value>
              </div>
              <div>
                <Label>Newsroom URL</Label>
                <Value>{this.props.charter.newsroomUrl}</Value>
              </div>
              <TwoSpanner>
                <LogoSection>
                  <div>
                    <Label>Newsroom Logo</Label>
                    <Value>{this.props.charter.logoUrl}</Value>
                  </div>
                  <AvatarWrap>
                    {this.props.charter.logoUrl ? <AvatarImg src={this.props.charter.logoUrl} /> : noAvatar}
                  </AvatarWrap>
                </LogoSection>
              </TwoSpanner>
              <TwoSpanner>
                <Label>Tagline</Label>
                <Value>{this.props.charter.tagline}</Value>
              </TwoSpanner>
              {this.renderSocial()}
            </GridWrapper>
          </CollapsableInner>
        </Collapsable>
        <Collapsable
          open={false}
          header={
            <SectionHeaders>
              <SectionHeaderCheck />Roster
            </SectionHeaders>
          }
        >
          <CollapsableInner>
            {this.props.charter.roster!.map((member: RosterMember) => {
              return <RosterMemberListItem member={member} key={member.ethAddress || member.name} />;
            })}
          </CollapsableInner>
        </Collapsable>
        <Collapsable
          open={false}
          header={
            <SectionHeaders>
              <SectionHeaderCheck />Charter
            </SectionHeaders>
          }
        >
          <CollapsableInner>
            <QuestionContainer>
              <Label>{questionsCopy[charterQuestions.PURPOSE]}</Label>
              <Value>{this.props.charter.mission && this.props.charter.mission[charterQuestions.PURPOSE]}</Value>
            </QuestionContainer>
            <QuestionContainer>
              <Label>{questionsCopy[charterQuestions.STRUCTURE]}</Label>
              <Value>{this.props.charter.mission && this.props.charter.mission[charterQuestions.STRUCTURE]}</Value>
            </QuestionContainer>
            <QuestionContainer>
              <Label>{questionsCopy[charterQuestions.REVENUE]}</Label>
              <Value>{this.props.charter.mission && this.props.charter.mission[charterQuestions.REVENUE]}</Value>
            </QuestionContainer>
            <QuestionContainer>
              <Label>{questionsCopy[charterQuestions.ENCUMBRANCES]}</Label>
              <Value>{this.props.charter.mission && this.props.charter.mission[charterQuestions.ENCUMBRANCES]}</Value>
            </QuestionContainer>
            <QuestionContainer>
              <Label>{questionsCopy[charterQuestions.MISCELLANEOUS]}</Label>
              <Value>{this.props.charter.mission && this.props.charter.mission[charterQuestions.MISCELLANEOUS]}</Value>
            </QuestionContainer>
          </CollapsableInner>
        </Collapsable>
        <Collapsable
          open={false}
          header={
            <SectionHeaders>
              <SectionHeaderCheck />Civil Constitution
            </SectionHeaders>
          }
        >
          <CollapsableInner>
            I agree to abide by the Civil Community's ethical principles as described in the Civil Constitution.
          </CollapsableInner>
        </Collapsable>
      </div>
    );
  }
  private renderSocial = (): JSX.Element | null => {
    if (!this.props.charter.socialUrls) {
      return null;
    }
    return (
      <>
        {!!this.props.charter.socialUrls!.twitter && (
          <div>
            <Label>Twitter Profile</Label>
            <Value>{this.props.charter.socialUrls!.twitter}</Value>
          </div>
        )}
        {!!this.props.charter.socialUrls!.facebook && (
          <div>
            <Label>Facebook Profile</Label>
            <Value>{this.props.charter.socialUrls!.facebook}</Value>
          </div>
        )}
      </>
    );
  };
}
