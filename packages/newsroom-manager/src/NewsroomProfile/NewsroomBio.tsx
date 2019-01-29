import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { find, findIndex } from "lodash";
import styled from "styled-components";
import { colors, fonts, StepHeader, StepProps, StepDescription, QuestionToolTip, Collapsable } from "@joincivil/components";
import { EthAddress, CharterData, RosterMember as RosterMemberInterface } from "@joincivil/core";
import { isValidHttpUrl } from "@joincivil/utils";
import {
  FormSection,
  FormTitle,
  FormSubhead,
  FormRow,
  FormRowItem,
  HelperText,
  StyledTextInput,
  StyledTextareaInput,
  SectionHeader,
  SectionDescription,
  StepSectionCounter,
} from "../styledComponents";
import { StateWithNewsroom } from "../reducers";
import { getUserObject } from "../utils";
import { UserData } from "../types";
import { LearnMoreButton } from "./LearnMoreButton";

export interface NewsroomBioProps extends StepProps {
  charter: Partial<CharterData>;
  updateCharter(charter: Partial<CharterData>): void;
}

const LogoFormWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: -4px;
`;
const LogoURLWrap = styled.div`
  flex-grow: 2;
  margin-right: 15px;
  padding-right: 15px;
  border-right: 1px solid ${colors.accent.CIVIL_GRAY_4};
`;
const LogoURLInput = styled(StyledTextInput)`
  &,
  input {
    margin-bottom: 0;
  }
`;
const LogoImgWrap = styled.div`
  position: relative;
  width: 100px;
`;
const LogoImg = styled.img`
  position: absolute;
  width: 100px;
  height: auto;
  top: -50%;
`;

const NewsroomURLInput = styled(StyledTextInput)`
  max-width: 400px;
`;
const TaglineTextarea = styled(StyledTextareaInput)`
  height: 80px;
  margin: -4px 0 0;
`;

const AddRosterMember = styled.a`
  display: block;
  cursor: pointer;
  padding: 22px 0 22px 30px;
  text-decoration: none;
  font-weight: bold;
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  outline: none !important;
  box-shadow: none !important;
`;

const SmallParagraph = styled.p`
  color: ${colors.primary.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  line-height: 24px;
`;

const CollapsableHeader = styled.h4`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  font-weight: bold;
  line-height: 32px;
  margin: 0;
`;

const StyledCollapsable = styled.div`
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  margin: 25px 0;
  padding: 17px 7px;
`;

export class NewsroomBio extends React.Component<NewsroomBioProps> {
  public render(): JSX.Element {
    const charter = this.props.charter;
    return (
      <>
        <SectionHeader>Create your Newsroom Registry profile</SectionHeader>
        <SectionDescription>
          Civil is based on transparency so we ask you to provide the following information to the best of your ability.
        </SectionDescription>
        <LearnMoreButton/>
        <StyledCollapsable>
          <Collapsable open={false} header={<CollapsableHeader> Where will this profile be viewable?</CollapsableHeader>}>
            <SmallParagraph>The information provided will help the Civil network assess your newsrooms compliance with the Civil Constitution and may be the basis for a challenge if warranted</SmallParagraph>
          </Collapsable>
        </StyledCollapsable>
        <SmallParagraph>
          To create your Newsroom Registry Profile, you will complete 4 steps:<br/>
          Newsroom Details, Roster, Charter, and Signing.
        </SmallParagraph>
        <StepSectionCounter>Step 1 of 4: Details</StepSectionCounter>
        <FormSection>
          <FormTitle>First, tell us about your Newsroom</FormTitle>
          <SmallParagraph>Enter your newsroom details below.</SmallParagraph>
          <div>
            <FormSubhead>Newsroom Name</FormSubhead>
            <NewsroomURLInput
              name="name"
              value={charter.name || ""}
              onChange={this.charterInputChange}
            />
          </div>
          <div>
            <FormSubhead>
              Logo
              <QuestionToolTip
                explainerText={
                  "You need to add a URL to a logo or image."
                }
              />
            </FormSubhead>
            <LogoFormWrap>
                <NewsroomURLInput
                  noLabel
                  name="logoUrl"
                  value={charter.logoUrl || ""}
                  onChange={this.charterInputChange}
                  invalid={this.invalidUrlInput(charter.logoUrl)}
                  invalidMessage={"Invalid URL"}
                />
            </LogoFormWrap>
            <HelperText style={{ marginTop: 4 }}>Must be image URL</HelperText>
          </div>

          <div>
            <FormSubhead>Newsroom URL</FormSubhead>
            <NewsroomURLInput
              name="newsroomUrl"
              value={charter.newsroomUrl || ""}
              onChange={this.charterInputChange}
              invalid={this.invalidUrlInput(charter.newsroomUrl)}
              invalidMessage={"Invalid URL"}
            />
          </div>

          <div>
            <FormSubhead>
              Tagline
              <QuestionToolTip explainerText={"This can be a tagline or short summary about your Newsroom."} />
            </FormSubhead>
            <TaglineTextarea
              name="tagline"
              value={charter.tagline || ""}
              onChange={this.charterInputChange}
              invalid={!!charter.tagline && charter.tagline.length > 120}
              invalidMessage={"Too long"}
            />
            <HelperText>Maximum of 120 Characters</HelperText>
          </div>

          <FormRow>
            <FormRowItem>
              <div>
                <FormSubhead optional>Twitter URL</FormSubhead>
                <StyledTextInput
                  name="twitter"
                  value={(charter.socialUrls || {}).twitter || ""}
                  onChange={this.charterSocialInputChange}
                  invalid={this.invalidUrlInput((charter.socialUrls || {}).twitter)}
                  invalidMessage={"Invalid URL"}
                />
              </div>
            </FormRowItem>
            <FormRowItem>
              <div>
                <FormSubhead optional>Facebook URL</FormSubhead>
                <StyledTextInput
                  name="facebook"
                  value={(charter.socialUrls || {}).facebook || ""}
                  onChange={this.charterSocialInputChange}
                  invalid={this.invalidUrlInput((charter.socialUrls || {}).facebook)}
                  invalidMessage={"Invalid URL"}
                />
              </div>
            </FormRowItem>
          </FormRow>
          <StepSectionCounter>Step 1 of 4: Details</StepSectionCounter>
        </FormSection>
      </>
    );
  }

  private charterInputChange = (name: string, val: string) => {
    this.props.updateCharter({
      ...this.props.charter,
      [name]: val,
    });
  };

  private charterSocialInputChange = (type: string, url: string) => {
    this.props.updateCharter({
      ...this.props.charter,
      socialUrls: {
        ...this.props.charter.socialUrls,
        [type]: url,
      },
    });
  };

  private invalidUrlInput = (url?: string): boolean => {
    return !!url && !isValidHttpUrl(url);
  };
}
