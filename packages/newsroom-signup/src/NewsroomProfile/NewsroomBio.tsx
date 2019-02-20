import * as React from "react";
import styled from "styled-components";
import { StepProps, QuestionToolTip } from "@joincivil/components";
import { CharterData } from "@joincivil/core";
import { isValidHttpUrl } from "@joincivil/utils";
import {
  CollapsableHeader,
  FormSection,
  FormTitle,
  FormSubhead,
  FormRow,
  FormRowItem,
  HelperText,
  SmallParagraph,
  StyledTextInput,
  StyledTextareaInput,
  SectionHeader,
  SectionDescription,
  StepSectionCounter,
  StyledCollapsable,
} from "../styledComponents";
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

const NewsroomURLInput = styled(StyledTextInput)`
  max-width: 400px;
`;
const TaglineTextarea = styled(StyledTextareaInput)`
  height: 80px;
  margin: -4px 0 0;
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
        <LearnMoreButton />
        <StyledCollapsable
          open={false}
          header={<CollapsableHeader> Where will this profile be viewable?</CollapsableHeader>}
        >
          <SmallParagraph>
            The information provided will help the Civil network assess your newsrooms compliance with the Civil
            Constitution and may be the basis for a challenge if warranted
          </SmallParagraph>
        </StyledCollapsable>
        <SmallParagraph>
          To create your Newsroom Registry Profile, you will complete 4 steps:<br />
          Newsroom Details, Roster, Charter, and Signing.
        </SmallParagraph>
        <StepSectionCounter>Step 1 of 4: Details</StepSectionCounter>
        <FormSection>
          <FormTitle>First, tell us about your Newsroom</FormTitle>
          <SmallParagraph>Enter your newsroom details below.</SmallParagraph>
          <div>
            <FormSubhead>Newsroom Name</FormSubhead>
            <NewsroomURLInput name="name" value={charter.name || ""} onChange={this.charterInputChange} />
          </div>
          <div>
            <FormSubhead>
              Logo
              <QuestionToolTip explainerText={"You need to add a URL to a logo or image."} />
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
