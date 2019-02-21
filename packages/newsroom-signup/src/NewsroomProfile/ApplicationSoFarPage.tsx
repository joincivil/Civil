import * as React from "react";
import styled from "styled-components";
import { fonts, colors, OBCollapsable } from "@joincivil/components";
import { AvatarWrap, AvatarImg, noAvatar } from "../styledComponents";
import { CharterData, RosterMember } from "@joincivil/core";
import { charterQuestions, questionsCopy } from "../constants";
import { RosterMemberListItem } from "./RosterMemberListItem";

export interface ApplicationSoFarPageProps {
  charter: Partial<CharterData>;
}

const Collapsable = styled(OBCollapsable)`
  margin-bottom: 0;
  margin-top: 0;
  border-bottom: none;
`;

const SectionHeaders = styled.h4`
  margin-bottom: 0;
  font-size: 16px;
  font-weight: bold;
  line-height: 32px;
  font-family: ${fonts.SANS_SERIF};
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
`;

const CollapsableInner = styled.div`
  padding: 10px 20px;
`;

const GridWrapper = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 40% 50%;
  grid-template-rows: 70px 70px auto 70px;
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
        <Collapsable open={true} header={<SectionHeaders>Newsroom Details</SectionHeaders>}>
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
        <Collapsable open={false} header={<SectionHeaders>Roster</SectionHeaders>}>
          <CollapsableInner>
            {this.props.charter.roster!.map((member: RosterMember) => {
              return <RosterMemberListItem member={member} />;
            })}
          </CollapsableInner>
        </Collapsable>
        <Collapsable open={false} header={<SectionHeaders>Charter</SectionHeaders>}>
          <CollapsableInner>
            <QuestionContainer>
              <Label>{questionsCopy[charterQuestions.PURPOSE]}</Label>
              <Value>{this.props.charter.mission![charterQuestions.PURPOSE]}</Value>
            </QuestionContainer>
            <QuestionContainer>
              <Label>{questionsCopy[charterQuestions.STRUCTURE]}</Label>
              <Value>{this.props.charter.mission![charterQuestions.STRUCTURE]}</Value>
            </QuestionContainer>
            <QuestionContainer>
              <Label>{questionsCopy[charterQuestions.REVENUE]}</Label>
              <Value>{this.props.charter.mission![charterQuestions.REVENUE]}</Value>
            </QuestionContainer>
            <QuestionContainer>
              <Label>{questionsCopy[charterQuestions.ENCUMBRANCES]}</Label>
              <Value>{this.props.charter.mission![charterQuestions.ENCUMBRANCES]}</Value>
            </QuestionContainer>
            <QuestionContainer>
              <Label>{questionsCopy[charterQuestions.MISCELLANEOUS]}</Label>
              <Value>{this.props.charter.mission![charterQuestions.MISCELLANEOUS]}</Value>
            </QuestionContainer>
          </CollapsableInner>
        </Collapsable>
        <Collapsable open={false} header={<SectionHeaders>Civil Constitution</SectionHeaders>}>
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
