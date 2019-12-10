import * as React from "react";
import styled from "styled-components";
import {
  StepProps,
  QuestionToolTip,
  OBCollapsable,
  OBCollapsableHeader,
  OBSmallParagraph,
  OBSectionHeader,
  OBSectionDescription,
} from "@joincivil/components";
import { CharterData } from "@joincivil/typescript-types";
import { isValidHttpUrl } from "@joincivil/utils";
import {
  FormSection,
  FormTitle,
  FormSubhead,
  FormRow,
  FormRowItem,
  HelperText,
  StyledTextInput,
  StyledImageToData,
  StyledTextareaInput,
  StepSectionCounter,
} from "../styledComponents";
import { LearnMoreButton } from "./LearnMoreButton";

export interface NewsroomBioProps extends StepProps {
  charter: Partial<CharterData>;
  /** Onboarding complete, now just managing info, so remove onboarding copy. */
  editMode?: boolean;
  updateCharter(charter: Partial<CharterData>): void;
}

const LogoFormWrap = styled.div`
  margin-bottom: 15px;
  small {
    background: white;
    padding: 5px 5px 5px 10px;
    right: 5px;
    top: 10px;
    width: auto;
    z-index: 1;
  }
`;

const LogoImgWrap = styled.div`
  position: relative;
  max-width: 130px;
`;

const LogoImg = styled.img`
  height: 130px;
  object-fit: contain;
  width: 130px;
`;

const NewsroomURLInput = styled(StyledTextInput)`
  max-width: 400px;
`;

const NewsroomLogoURLInput = styled(StyledImageToData)`
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
        {!this.props.editMode && this.renderOnboardingHeader()}
        <FormSection>
          {!this.props.editMode && (
            <>
              <FormTitle>First, tell us about your Newsroom</FormTitle>
              <OBSmallParagraph>Enter your newsroom details below.</OBSmallParagraph>
            </>
          )}
          <div>
            <FormSubhead>Newsroom Name</FormSubhead>
            <NewsroomURLInput name="name" value={charter.name || ""} onChange={this.charterInputChange} />
          </div>
          <div>
            <FormSubhead>
              Newsroom Logo
              <QuestionToolTip
                explainerText={
                  "Recommended dimensions 260x260px, maximum file size 250KB. Image will be displayed constrained to a square."
                }
              />
            </FormSubhead>
            <LogoFormWrap>
              <LogoImgWrap>{charter.logoUrl && <LogoImg src={charter.logoUrl} />}</LogoImgWrap>
              <NewsroomLogoURLInput
                onChange={(dataUri: string) => this.charterInputChange("logoUrl", dataUri)}
                buttonText={charter.logoUrl ? "Change Image" : "Add Image"}
              />
            </LogoFormWrap>
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
          {!this.props.editMode && <StepSectionCounter>Step 1 of 4: Details</StepSectionCounter>}
        </FormSection>
      </>
    );
  }

  private renderOnboardingHeader(): JSX.Element {
    return (
      <>
        <OBSectionHeader>Create your Newsroom Registry profile</OBSectionHeader>
        <OBSectionDescription>
          Civil is based on transparency so we ask you to provide the following information to the best of your ability.
        </OBSectionDescription>
        <LearnMoreButton />
        <OBCollapsable
          open={false}
          header={<OBCollapsableHeader> Where will this profile be viewable?</OBCollapsableHeader>}
        >
          <OBSmallParagraph>
            The information provided will help the Civil network assess your newsrooms compliance with the Civil
            Constitution and may be the basis for a challenge if warranted
          </OBSmallParagraph>
        </OBCollapsable>
        <OBSmallParagraph>
          To create your Newsroom Registry Profile, you will complete 4 steps:
          <br />
          Newsroom Details, Roster, Charter, and Signing.
        </OBSmallParagraph>
        <StepSectionCounter>Step 1 of 4: Details</StepSectionCounter>
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
