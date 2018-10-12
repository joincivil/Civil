import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { findIndex } from "lodash";
import styled from "styled-components";
import {
  colors,
  StepHeader,
  StepProps,
  StepDescription,
  QuestionToolTip,
  buttonSizes,
  TextInput,
  TextareaInput,
} from "@joincivil/components";
import { EthAddress, CharterData, RosterMember as RosterMemberInterface } from "@joincivil/core";
import { RosterMember } from "./RosterMember";
import {
  FormSection,
  FormTitle,
  FormSubhead,
  FormRow,
  FormRowItem,
  HelperText,
  TertiaryButton,
} from "./styledComponents";
import { StateWithNewsroom } from "./reducers";
import { makeUserObject } from "./utils";
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

  ${TertiaryButton} {
    margin: 6px 0 0;
  }
`;
const LogoURLWrap = styled.div`
  flex-grow: 2;
  margin-right: 15px;
  padding-right: 15px;
  border-right: 1px solid ${colors.accent.CIVIL_GRAY_4};
`;
const LogoURLInput = styled(TextInput)`
  &,
  input {
    margin-bottom: 0;
  }
`;

const NewsroomURLInput = styled(TextInput)`
  max-width: 400px;
`;
const TaglineTextarea = styled(TextareaInput)`
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
  constructor(props: CreateCharterPartOneProps) {
    super(props);
  }

  public render(): JSX.Element {
    const contractUsers = this.props.owners.concat(this.props.editors);
    const nonRosterContractUsers = contractUsers.filter(
      user => findIndex(this.props.charter.roster, { ethAddress: user.rosterData.ethAddress }) === -1,
    );

    return (
      <>
        <StepHeader>Create your Registry profile</StepHeader>
        <StepDescription>
          Add your Newsroom profile information. This will be included on your smart contract and shown on your listing
          page in the Civil Registry.
        </StepDescription>

        <FormSection>
          <FormTitle>Newsroom Profile</FormTitle>
          <p>Enter your newsroom profile details.</p>

          <div>
            <FormSubhead>
              Logo
              <QuestionToolTip
                explainerText={
                  "You need to add a URL to a logo or image. You can add a logo to your WordPress media library and copy the URL here. We recommend the image dimensions to be at minimum  300 x 300 pixels."
                }
              />
            </FormSubhead>
            <LogoFormWrap>
              <LogoURLWrap>
                <LogoURLInput
                  placeholder="Enter URL or Open Media Library"
                  noLabel
                  name="logoUrl"
                  value={this.props.charter.logoUrl || ""}
                  onChange={this.charterInputChange}
                />
              </LogoURLWrap>
              <TertiaryButton size={buttonSizes.SMALL}>Open Media Library</TertiaryButton>
            </LogoFormWrap>
            <HelperText style={{ marginTop: 4 }}>Must be image URL</HelperText>
          </div>

          <div>
            <FormSubhead>
              Newsroom URL
              {/*TODO: pre-fill with value from CMS*/}
            </FormSubhead>
            <NewsroomURLInput
              name="newsroomUrl"
              value={this.props.charter.newsroomUrl || ""}
              onChange={this.charterInputChange}
            />
          </div>

          <div>
            <FormSubhead>
              Tagline
              <QuestionToolTip explainerText={"This can be a tagline or short summary about your Newsroom."} />
            </FormSubhead>
            <TaglineTextarea
              name="tagline"
              value={this.props.charter.tagline || ""}
              onChange={this.charterInputChange}
            />
            <HelperText>Maximum of 120 Characters</HelperText>
          </div>

          <FormRow>
            <FormRowItem>
              <div>
                <FormSubhead optional>Twitter URL</FormSubhead>
                <TextInput
                  name="twitter"
                  value={(this.props.charter.socialUrls || {}).twitter || ""}
                  onChange={this.charterSocialInputChange}
                />
              </div>
            </FormRowItem>
            <FormRowItem>
              <div>
                <FormSubhead optional>Facebook URL</FormSubhead>
                <TextInput
                  name="facebook"
                  value={(this.props.charter.socialUrls || {}).facebook || ""}
                  onChange={this.charterSocialInputChange}
                />
              </div>
            </FormRowItem>
          </FormRow>
        </FormSection>

        <FormSection>
          <FormTitle>Newsroom Roster</FormTitle>
          <p>
            Select the participants in your WordPress newsroom you want to add your roster and include any relevant
            credentials.
          </p>
          {(this.props.charter.roster || []).map(member => {
            return (
              <RosterMember
                newsroomAddress={this.props.address!}
                key={member.ethAddress}
                user={{ rosterData: member }}
                onRoster={true}
                onContract={findIndex(contractUsers, user => user.rosterData.ethAddress === member.ethAddress) !== -1}
                updateRosterMember={this.rosterMemberUpdate}
                newUser={!member.ethAddress}
              />
            );
          })}
          {nonRosterContractUsers.map(user => {
            return (
              <RosterMember
                newsroomAddress={this.props.address!}
                key={user.rosterData.ethAddress}
                user={user}
                onRoster={false}
                onContract={true}
                updateRosterMember={this.rosterMemberUpdate}
              />
            );
          })}
          <AddRosterMember href="#" onClick={this.addRosterMember}>
            Add Additional Roster Member
          </AddRosterMember>
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

  private addRosterMember = (e: any) => {
    e.preventDefault();
    const newMember: RosterMemberInterface = {} as any;
    this.props.updateCharter({
      ...this.props.charter,
      roster: (this.props.charter.roster || []).concat(newMember),
    });
  };

  private rosterMemberUpdate = (onRoster: boolean, member: Partial<RosterMemberInterface>, newUser?: boolean) => {
    let roster = (this.props.charter.roster || []).slice();
    let memberIndex;
    if (newUser) {
      memberIndex = findIndex(roster, rosterMember => rosterMember.ethAddress === undefined);
    } else {
      memberIndex = findIndex(roster, rosterMember => rosterMember.ethAddress === member.ethAddress);
    }
    const wasOnRoster = memberIndex !== -1;

    if (wasOnRoster) {
      if (onRoster) {
        roster[memberIndex] = member as RosterMemberInterface;
      } else {
        roster.splice(memberIndex, 1);
      }
    } else {
      if (onRoster) {
        roster = roster.concat(member as RosterMemberInterface);
      } else {
        return;
      }
    }

    this.props.updateCharter({
      ...this.props.charter,
      roster,
    });
  };
}

const mapStateToProps = (
  state: StateWithNewsroom,
  ownProps: CreateCharterPartOneExternalProps,
): CreateCharterPartOneProps => {
  const newsroom = state.newsrooms.get(ownProps.address || "") || { wrapper: { data: {} } };
  const owners: UserData[] = (newsroom.wrapper.data.owners || []).map(makeUserObject.bind(null, state));
  const editors: UserData[] = (newsroom.editors || []).map(makeUserObject.bind(null, state));

  return {
    ...ownProps,
    owners,
    editors,
  };
};

export const CreateCharterPartOne = connect(mapStateToProps)(CreateCharterPartOneComponent);
