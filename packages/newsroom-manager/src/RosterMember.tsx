import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { colors, Checkbox, ToolTip, TextInput, TextareaInput, buttonSizes } from "@joincivil/components";
import { EthAddress, RosterMember as RosterMemberInterface } from "@joincivil/core";
import styled from "styled-components";
import { FormSubhead, FormRow, FormRowItem, HelperText, TertiaryButton } from "./styledComponents";
import { StateWithNewsroom } from "./reducers";
import { UserData } from "./types";

export interface RosterMemberProps {
  newsroomAddress: EthAddress;
  user: UserData;
  onRoster: boolean;
  onContract?: boolean;
  newUser?: boolean;
  updateRosterMember(onRoster: boolean, member: Partial<RosterMemberInterface>, newUser?: boolean): void;
}

export interface RosterMemberState {
  newUserAddress?: EthAddress;
}

const Wrapper = styled.div`
  padding: 20px 0;
  border-top: 1px solid ${colors.accent.CIVIL_GRAY_4};
`;

const DisplayName = FormSubhead.extend`
  display: inline-block;
  font-weight: bold;
  margin: 0 10px 0 0;
`;
const Username = styled.span`
  color: #72777c;
  margin-right: 10px;
`;

const AvatarWrap = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin: 0 8px 0 10px;
  width: 24px;
  height: 24px;
`;
const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
`;
const _NoAvatar = styled.div`
  display: inline-block;
  width: 24px;
  height: 21px;
  padding-top: 3px;
  text-align: center;
  font-weight: bold;
  background-color: ${colors.accent.CIVIL_GRAY_4};
  color: ${colors.accent.CIVIL_GRAY_2};
`;
const noAvatar = <_NoAvatar>?</_NoAvatar>;

const Input = styled(TextInput)`
  margin: -8px 0 -20px;
`;
const Textarea = styled(TextareaInput)`
  margin: -8px 0 0;
`;

export class RosterMemberComponent extends React.Component<RosterMemberProps & DispatchProp<any>, RosterMemberState> {
  constructor(props: RosterMemberProps & DispatchProp<any>) {
    super(props);
    this.state = {};
  }

  public render(): JSX.Element {
    const user = this.props.user;
    return (
      <Wrapper>
        <div>
          <Checkbox checked={this.props.onRoster} onClick={this.toggleOnRoster} />

          <AvatarWrap>
            {user.isCmsUser ? (
              <ToolTip explainerText="This user can change their profile image by going to Gravatar and signing in with the email account they use for this WordPress site.">
                {user.rosterData.avatarUrl ? <AvatarImg src={user.rosterData.avatarUrl} /> : noAvatar}
              </ToolTip>
            ) : (
              user.rosterData.avatarUrl && <AvatarImg src={user.rosterData.avatarUrl} />
            )}
          </AvatarWrap>

          {user.rosterData.name && <DisplayName>{user.rosterData.name}</DisplayName>}
          {user.username && <Username>{user.username}</Username>}
          {user.rosterData.ethAddress && <code>{user.rosterData.ethAddress}</code>}
        </div>

        {this.props.newUser && (
          <>
            <FormSubhead>Wallet Address</FormSubhead>
            <FormRow>
              <FormRowItem style={{ marginTop: 2 }}>
                <Input name="ethAddress" value={this.state.newUserAddress || ""} onChange={this.addressInputChange} />
              </FormRowItem>
              <FormRowItem>
                <TertiaryButton size={buttonSizes.SMALL} onClick={this.saveNewMember}>
                  Add Member
                </TertiaryButton>
              </FormRowItem>
            </FormRow>
          </>
        )}

        {!this.props.newUser &&
          this.props.onRoster && (
            <>
              {!user.isCmsUser && (
                <FormRow>
                  <FormRowItem>
                    <FormSubhead>Name</FormSubhead>
                    <Input name="name" value={user.rosterData.name || ""} onChange={this.rosterInputChange} />
                  </FormRowItem>
                  <FormRowItem>
                    <FormSubhead optional>Avatar URL</FormSubhead>
                    <Input name="avatarUrl" value={user.rosterData.avatarUrl || ""} onChange={this.rosterInputChange} />
                  </FormRowItem>
                </FormRow>
              )}

              <FormRow>
                <FormRowItem>
                  <FormSubhead>Role</FormSubhead>
                  <Input name="role" value={user.rosterData.role} onChange={this.rosterInputChange} />
                </FormRowItem>
                <FormRowItem>
                  <FormSubhead optional>Twitter URL</FormSubhead>
                  <Input name="twitterUrl" value={user.rosterData.twitterUrl} onChange={this.rosterInputChange} />
                </FormRowItem>
              </FormRow>

              <FormSubhead>Bio</FormSubhead>
              <Textarea name="bio" value={user.rosterData.bio} onChange={this.rosterInputChange} />
              <HelperText>Maximum of 120 characters</HelperText>
            </>
          )}
      </Wrapper>
    );
  }

  private saveNewMember = () => {
    this.props.updateRosterMember(
      this.props.onRoster,
      {
        ethAddress: this.state.newUserAddress,
      },
      true,
    );
  };

  private addressInputChange = (name: string, val: string) => {
    this.setState({ newUserAddress: val });
  };

  private toggleOnRoster = () => {
    this.props.updateRosterMember(!this.props.onRoster, this.props.user.rosterData);
  };

  private rosterInputChange = (name: string, val: string) => {
    this.props.updateRosterMember(this.props.onRoster, {
      ...this.props.user.rosterData!,
      [name]: val,
    });
  };
}

const mapStateToProps = (state: StateWithNewsroom, ownProps: RosterMemberProps): RosterMemberProps => {
  return ownProps;
};

export const RosterMember = connect(mapStateToProps)(RosterMemberComponent);
