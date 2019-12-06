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
import { CharterData, RosterMember } from "@joincivil/typescript-types";
import { charterQuestions, questionsCopy } from "../constants";
import { RosterMemberListItem } from "./RosterMemberListItem";

export interface ApplicationSoFarPageProps {
  charter: Partial<CharterData>;
  /** Onboarding complete, now just managing info, so remove onboarding copy. */
  editMode?: boolean;
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

const QuestionContainer = styled.div`
  padding: 20px 0;
  ${Label} {
    margin-bottom: 10px;
  }
`;

const StyledAvatarWrap = styled(AvatarWrap)`
  margin: 5px 10px;
`;
const NewsroomLogoWrap = styled(StyledAvatarWrap)`
  height: 130px;
  width: 130px;
`;
const NewsroomLogo = styled(AvatarImg)`
  border-radius: 0;
  object-fit: contain;
`;

export class ApplicationSoFarPage extends React.Component<ApplicationSoFarPageProps> {
  public render(): JSX.Element {
    return (
      <>
        {!this.props.editMode && this.renderOnboardingHeader()}
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
                <div>
                  <Label>Newsroom Logo</Label>
                  <NewsroomLogoWrap>
                    {this.props.charter.logoUrl ? <NewsroomLogo src={this.props.charter.logoUrl} /> : noAvatar}
                  </NewsroomLogoWrap>
                </div>
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
          open={true}
          header={
            <SectionHeaders>
              <SectionHeaderCheck />
              Roster
            </SectionHeaders>
          }
        >
          <CollapsableInner>
            {this.props.charter.roster &&
              this.props.charter.roster.map((member: RosterMember) => {
                return <RosterMemberListItem member={member} key={member.ethAddress || member.name} />;
              })}
          </CollapsableInner>
        </Collapsable>
        <Collapsable
          open={true}
          header={
            <SectionHeaders>
              <SectionHeaderCheck />
              Charter
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
          open={true}
          header={
            <SectionHeaders>
              <SectionHeaderCheck />
              Civil Constitution
            </SectionHeaders>
          }
        >
          <CollapsableInner>
            I agree to abide by the Civil Community's ethical principles as described in the Civil Constitution.
          </CollapsableInner>
        </Collapsable>
      </>
    );
  }

  private renderOnboardingHeader(): JSX.Element {
    return (
      <>
        <OBSectionHeader>Here’s your Registry Profile so far</OBSectionHeader>
        <OBSectionDescription>
          Please review your newsroom Registry Profile. Keep in mind that this is a public document.
        </OBSectionDescription>
      </>
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
