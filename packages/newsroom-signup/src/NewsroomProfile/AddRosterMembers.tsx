import * as React from "react";
import { LearnMoreButton } from "./LearnMoreButton";
import { StyledHr, FormSection, StepSectionCounter } from "../styledComponents";
import { CharterData, RosterMember as RosterMemberInterface, EthAddress } from "@joincivil/core";
import {
  InvertedButton,
  BorderlessButton,
  buttonSizes,
  OBSectionHeader,
  OBSectionDescription,
} from "@joincivil/components";
import { RosterMember } from "./RosterMember";
import styled from "styled-components";
import { RosterMemberListItem } from "./RosterMemberListItem";

export interface AddRosterMemberProps {
  charter: Partial<CharterData>;
  profileWalletAddress?: EthAddress;
  updateCharter(charter: Partial<CharterData>): void;
  setButtonVisibility(visibility: boolean): void;
}

export interface AddRosterMemberState {
  editingMember: Partial<RosterMemberInterface> | null;
  editingIndex: number;
}

const LowerHeader = styled(OBSectionHeader)`
  font-size: 20px;
  text-align: left;
`;

const LowerDescription = styled(OBSectionDescription)`
  text-align: left;
`;

const StyledCounter = styled(StepSectionCounter)`
  margin-bottom: 35px;
`;

const StyledUl = styled.ul`
  list-style: none;
  margin: 0 0 35px 0;
  padding: 0;
`;

const ButtonSection = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 15px;
`;

const RemoveButton = styled(BorderlessButton)`
  margin-left: auto;
`;

export class AddRosterMember extends React.Component<AddRosterMemberProps, AddRosterMemberState> {
  constructor(props: AddRosterMemberProps) {
    super(props);
    this.state = {
      editingMember: null,
      editingIndex: -1,
    };
  }
  public render(): JSX.Element {
    return (
      <>
        <OBSectionHeader>Now, add your team to the Newsroom Roster</OBSectionHeader>
        <OBSectionDescription>
          Your newsroom roster is a list of journalists who are part of your newsroom. This is part of your public
          Registry Profile.
        </OBSectionDescription>
        <LearnMoreButton />
        <StyledHr />
        <FormSection>
          <LowerHeader>Newsroom Roster</LowerHeader>
          <LowerDescription>Add yourself, in addition to any staff or team members to your roster.</LowerDescription>
          <StyledCounter>Step 2 of 4: Roster</StyledCounter>
          {this.state.editingMember ? (
            <RosterMember
              user={{ rosterData: this.state.editingMember }}
              updateRosterMember={this.rosterMemberUpdate}
            />
          ) : (
            <StyledUl>
              {(this.props.charter.roster || []).map((member, i) => {
                return <RosterMemberListItem key={i} member={member} edit={() => this.editRosterMember(i)} />;
              })}
            </StyledUl>
          )}
          {this.state.editingMember ? (
            <ButtonSection>
              <InvertedButton size={buttonSizes.MEDIUM} onClick={this.saveRosterMember}>
                Save
              </InvertedButton>
              <BorderlessButton size={buttonSizes.MEDIUM} onClick={this.cancelEdit}>
                Cancel
              </BorderlessButton>
              <RemoveButton size={buttonSizes.MEDIUM} onClick={this.removeRosterMember}>
                Remove
              </RemoveButton>
            </ButtonSection>
          ) : (
            <InvertedButton size={buttonSizes.MEDIUM_WIDE} onClick={this.addRosterMember}>
              {this.props.charter.roster && this.props.charter.roster.length
                ? "Add a profile"
                : "Add yourself to roster"}
            </InvertedButton>
          )}
        </FormSection>
      </>
    );
  }

  private addRosterMember = (e: any) => {
    e.preventDefault();
    this.props.setButtonVisibility(false);
    const editingMember: Partial<RosterMemberInterface> = {};
    if (!this.props.charter.roster || (this.props.charter.roster && this.props.charter.roster.length === 0)) {
      editingMember.ethAddress = this.props.profileWalletAddress;
    }
    this.setState({ editingMember });
  };

  private cancelEdit = () => {
    this.props.setButtonVisibility(true);
    this.setState({ editingMember: null, editingIndex: -1 });
  };

  private rosterMemberUpdate = (newVal: Partial<RosterMemberInterface>): void => {
    this.setState({ editingMember: newVal });
  };

  private removeRosterMember = () => {
    const roster = (this.props.charter.roster || []).slice();
    const memberIndex = this.state.editingIndex;
    if (memberIndex >= 0) {
      roster.splice(memberIndex, 1);
      this.props.updateCharter({
        ...this.props.charter,
        roster,
      });
    }
    this.props.setButtonVisibility(true);
    this.setState({ editingMember: null, editingIndex: -1 });
  };

  private saveRosterMember = () => {
    const roster = (this.props.charter.roster || []).slice();
    const memberIndex = this.state.editingIndex;
    if (memberIndex >= 0) {
      roster[memberIndex] = this.state.editingMember as RosterMemberInterface;
    } else {
      roster.push(this.state.editingMember as RosterMemberInterface);
    }

    this.props.updateCharter({
      ...this.props.charter,
      roster,
    });
    this.props.setButtonVisibility(true);
    this.setState({ editingMember: null, editingIndex: -1 });
  };

  private editRosterMember = (index: number) => {
    this.props.setButtonVisibility(false);
    this.setState({ editingMember: this.props.charter.roster![index], editingIndex: index });
  };
}
