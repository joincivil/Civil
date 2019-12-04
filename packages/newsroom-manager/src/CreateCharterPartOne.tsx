import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { find, findIndex } from "lodash";
import styled from "styled-components";
import { colors, StepHeader, StepProps, StepDescription, QuestionToolTip } from "@joincivil/components";
import { EthAddress, CharterData, RosterMember as RosterMemberInterface } from "@joincivil/typescript-types";
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

        <FormSection>
          <FormTitle>Newsroom Roster</FormTitle>
          <p>
            Select the participants in your WordPress newsroom you want to add your roster and include any relevant
            credentials.
          </p>
          {(charter.roster || []).map((member, i) => {
            const contractUser = find(contractUsers, user => user.rosterData.ethAddress === member.ethAddress);
            return (
              <RosterMember
                newsroomAddress={this.props.address!}
                key={i}
                user={{
                  rosterData: member,
                  isCmsUser: contractUser && contractUser.isCmsUser,
                  username: contractUser && contractUser.username,
                }}
                onContract={!!contractUser}
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
    const newMember = {};
    this.props.updateCharter({
      ...this.props.charter,
      roster: (this.props.charter.roster || []).concat(newMember as RosterMemberInterface),
    });
  };

  private rosterMemberUpdate = (
    oldVal: Partial<RosterMemberInterface>,
    newVal: Partial<RosterMemberInterface>,
    deleteMember?: boolean,
  ) => {
    const roster = (this.props.charter.roster || []).slice();

    if (
      newVal.ethAddress &&
      oldVal.ethAddress !== newVal.ethAddress &&
      find(roster, rosterMember => rosterMember.ethAddress === newVal.ethAddress)
    ) {
      // Address being updated to an address already on roster, an edge-case that would put UI in a weird state, a pain to handle, so just alert for now and don't apply change.
      alert('Wallet address "' + newVal.ethAddress + '" already exists your newsroom roster.');
      return;
    }

    const key = oldVal.ethAddress ? "ethAddress" : "name";
    const memberIndex = findIndex(roster, rosterMember => rosterMember[key] === oldVal[key]);

    if (deleteMember) {
      roster.splice(memberIndex, 1);
    } else {
      roster[memberIndex] = newVal as RosterMemberInterface;
    }

    this.props.updateCharter({
      ...this.props.charter,
      roster,
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
