import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { find, findIndex } from "lodash";
import styled from "styled-components";
import { colors, StepHeader, StepProps, StepDescription, QuestionToolTip } from "@joincivil/components";
import { EthAddress, CharterData, RosterMember as RosterMemberInterface } from "@joincivil/core";
import { isValidHttpUrl } from "@joincivil/utils";
import { RosterMember } from "./RosterMember";
import {
  FormSection,
  FormTitle,
  FormSubhead,
  FormRow,
  FormRowItem,
  HelperText,
  StyledTextInput,
  StyledTextareaInput,
} from "./styledComponents";
import { StateWithNewsroom } from "./reducers";
import { getUserObject } from "./utils";
import { UserData } from "./types";

export interface CreateCharterPartOneExternalProps extends StepProps {
  charter: Partial<CharterData>;
  address?: EthAddress;
  updateCharter(charter: Partial<CharterData>): void;
}

export interface CreateCharterPartOneProps extends CreateCharterPartOneExternalProps {
  owners: UserData[];
  editors: UserData[];
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

class CreateCharterPartOneComponent extends React.Component<CreateCharterPartOneProps & DispatchProp<any>> {
  public render(): JSX.Element {
    const charter = this.props.charter;
    const contractUsers = this.props.owners.concat(this.props.editors);

    return (
      <>
        <StepHeader>Create your Newsroom Registry profile</StepHeader>
        <StepDescription>
          Civil is based on transparency so we ask you to provide the following information to the best of your ability.
        </StepDescription>

        <FormSection>
          <FormTitle>Newsroom Profile</FormTitle>
          <p>Enter your newsroom profile details.</p>

          <div>
            <FormSubhead>
              Logo
              <QuestionToolTip
                explainerText={
                  "You need to add a URL to a logo or image. If you set a Site Icon in your WordPress dashboard under Appearance > Customize > Site Identity it will be used here. We recommend the image be square and at minimum 300 x 300 pixels."
                }
              />
            </FormSubhead>
            <LogoFormWrap>
              <LogoURLWrap>
                <LogoURLInput
                  noLabel
                  name="logoUrl"
                  value={charter.logoUrl || ""}
                  onChange={this.charterInputChange}
                  invalid={this.invalidUrlInput(charter.logoUrl)}
                  invalidMessage={"Invalid URL"}
                />
              </LogoURLWrap>
              <LogoImgWrap>{charter.logoUrl && <LogoImg src={charter.logoUrl} />}</LogoImgWrap>
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

const mapStateToProps = (
  state: StateWithNewsroom,
  ownProps: CreateCharterPartOneExternalProps,
): CreateCharterPartOneProps => {
  const newsroom = state.newsrooms.get(ownProps.address || "") || { wrapper: { data: {} } };
  const owners: UserData[] = (newsroom.wrapper.data.owners || []).map(getUserObject.bind(null, state));
  const editors: UserData[] = ((newsroom.editors && newsroom.editors.toArray()) || []).map(
    getUserObject.bind(null, state),
  );

  return {
    ...ownProps,
    owners,
    editors,
  };
};

export const CreateCharterPartOne = connect(mapStateToProps)(CreateCharterPartOneComponent);
