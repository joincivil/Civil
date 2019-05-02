import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { colors, fonts } from "@joincivil/components";
import { RosterMember as RosterMemberInterface } from "@joincivil/core";
import { isValidHttpUrl } from "@joincivil/utils";
import styled from "styled-components";
import {
  FormSubhead,
  FormRow,
  FormRowItem,
  HelperText,
  StyledTextInput,
  StyledTextareaInput,
  StyledImageToData,
} from "../styledComponents";
import { StateWithNewsroom } from "../reducers";
import { UserData } from "../types";

export interface RosterMemberProps {
  user: UserData;
  updateRosterMember(newVal: Partial<RosterMemberInterface>): void;
}

const Wrapper = styled.div`
  padding: 20px 0;
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
`;

const Input = styled(StyledTextInput)`
  margin: -8px 0 -20px;
`;

const Textarea = styled(StyledTextareaInput)`
  margin: -8px 0 0;
  small {
    top: 70px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 70% 30%;
`;

const ImageLabel = styled.p`
  color: ${colors.accent.CIVIL_GRAY_2};
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
`;

const Image = styled.img`
  display: inline;
  margin: 0 auto;
  height: 100%;
  width: auto;
`;

const ImageCropper = styled.div`
  width: 72px;
  height: 72px;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
`;

const ImageArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const EmailHelpText = styled(HelperText)`
  margin: 0;
  padding: 0;
`;

export class RosterMemberComponent extends React.Component<RosterMemberProps & DispatchProp<any>> {
  constructor(props: RosterMemberProps & DispatchProp<any>) {
    super(props);
  }

  public render(): JSX.Element {
    const user = this.props.user;
    let imgArea: JSX.Element | null = null;
    if (user.rosterData.avatarUrl && user.rosterData.avatarUrl !== "") {
      imgArea = (
        <ImageArea>
          <ImageLabel>Profile photo</ImageLabel>
          <ImageCropper>
            <Image src={user.rosterData.avatarUrl} />
          </ImageCropper>
        </ImageArea>
      );
    }
    return (
      <Grid>
        <Wrapper>
          <FormSubhead>Name</FormSubhead>
          <Input name="name" value={user.rosterData.name || ""} onChange={this.rosterInputChange} />
          <FormSubhead optional>Avatar URL</FormSubhead>
          <StyledImageToData onChange={(dataUri: string) => this.rosterInputChange("avatarUrl", dataUri)} />
          <FormSubhead>Role</FormSubhead>
          <Input name="role" value={user.rosterData.role} onChange={this.rosterInputChange} />

          <FormSubhead>Bio</FormSubhead>
          <Textarea
            name="bio"
            value={user.rosterData.bio}
            onChange={this.rosterInputChange}
            invalid={!!user.rosterData.bio && user.rosterData.bio.length > 1000}
            invalidMessage={"Too long"}
          />
          <HelperText>Maximum of 1000 characters</HelperText>
          <FormSubhead optional>Public Wallet Address</FormSubhead>
          <Input name="ethAddress" value={user.rosterData.ethAddress || ""} onChange={this.rosterInputChange} />
          <FormSubhead optional>Email Address</FormSubhead>
          <EmailHelpText>Email addresses will not be displayed on the Registry Profile page. </EmailHelpText>
          <Input
            name="email"
            value={(user.rosterData.socialUrls || {}).email}
            onChange={this.rosterSocialInputChange}
          />
          <FormRow>
            <FormRowItem>
              <FormSubhead optional>Twitter URL</FormSubhead>
              <Input
                name="twitter"
                value={(user.rosterData.socialUrls || {}).twitter}
                onChange={this.rosterSocialInputChange}
                invalid={
                  !!user.rosterData.socialUrls &&
                  !!user.rosterData.socialUrls.twitter &&
                  !isValidHttpUrl(user.rosterData.socialUrls.twitter)
                }
                invalidMessage={"Invalid URL"}
              />
            </FormRowItem>
            <FormRowItem>
              <FormSubhead optional>Facebook</FormSubhead>
              <Input
                name="facebook"
                value={(user.rosterData.socialUrls || {}).facebook}
                onChange={this.rosterSocialInputChange}
              />
            </FormRowItem>
          </FormRow>
        </Wrapper>
        {imgArea}
      </Grid>
    );
  }

  private rosterInputChange = (name: string, val: string) => {
    this.props.updateRosterMember({
      ...this.props.user.rosterData,
      [name]: val,
    });
  };

  private rosterSocialInputChange = (type: string, val: string) => {
    this.props.updateRosterMember({
      ...this.props.user.rosterData,
      socialUrls: {
        ...this.props.user.rosterData.socialUrls,
        [type]: val,
      },
    });
  };
}

const mapStateToProps = (state: StateWithNewsroom, ownProps: RosterMemberProps): RosterMemberProps => {
  return ownProps;
};

export const RosterMember = connect(mapStateToProps)(RosterMemberComponent);
