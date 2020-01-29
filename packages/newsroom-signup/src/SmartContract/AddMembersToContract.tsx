import * as React from "react";
import { connect } from "react-redux";
import {
  OBSectionHeader,
  OBSectionDescription,
  OBCollapsable,
  OBCollapsableHeader,
  OBSmallParagraph,
  fonts,
  colors,
  CivilContext,
  ICivilContext,
} from "@joincivil/components";
import { CharterData, EthAddress, RosterMember } from "@joincivil/typescript-types";
import { NewsroomInstance } from "@joincivil/core";
import styled from "styled-components";
import { AddMember } from "./AddMember";
import { StateWithNewsroom } from "../reducers";

const MemberUL = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MemberUlLabels = styled.li`
  display: grid;
  grid-template-columns: 28% 15% 27% 30%;
  border-bottom: 1px solid ${colors.accent.CIVIL_GRAY_4};
  padding-bottom: 10px;
`;

const MemberUlLabel = styled.div`
  font-size: 13px;
  letter-spacing: -0.14px;
  line-height: 16px;
  font-family: ${fonts.SANS_SERIF};
  color: ${colors.accent.CIVIL_GRAY_3};
  text-align: left;
`;

export interface AddMembersToContractProps {
  charter: Partial<CharterData>;
  newsroom: NewsroomInstance;
  profileWalletAddress?: EthAddress;
  managerMode?: boolean;
  nonCharterMembers?: EthAddress[];
  updateCharter(charter: Partial<CharterData>): void;
}

type ContractMemberData = Partial<RosterMember> & { notInCharter: boolean };

export class AddMembersToContractComponent extends React.Component<AddMembersToContractProps> {
  public static contextType = CivilContext;
  public context: ICivilContext;

  public render(): JSX.Element {
    const members = ((this.props.charter.roster as ContractMemberData[]) || []).concat(
      (this.props.nonCharterMembers || []).map(address => ({
        ethAddress: address!,
        notInCharter: true,
      })),
    );

    return (
      <>
        <OBSectionHeader>Assign access to your Newsroom Smart Contract</OBSectionHeader>
        <OBSectionDescription>
          {this.props.managerMode ? "Here you can" : "Now you'll"} assign roles to key staff which will determine their
          level of access to the Newsroom Smart Contract. We recommend adding at least two people as Officers to your
          Newsroom Smart Contract. This is for your protection in the event you lose access to your wallet.
        </OBSectionDescription>
        <OBSectionDescription>
          If you are the only Officer on your contract and you lose access to your wallet, you will no longer you will
          no longer be able to access your newsroom and will have to create a new one. In order to be assigned to the
          smart contract, your key staff will each need to set up a MetaMask wallet.
        </OBSectionDescription>
        <OBCollapsable
          open={false}
          header={<OBCollapsableHeader>What are the types of Civil roles?</OBCollapsableHeader>}
        >
          <OBSmallParagraph>
            <strong>Officer</strong> is an admin role that has all possible capabilities in the Newsroom Smart Contract.
            They can add additional officers and members and have access to your newsrooms funds and Civil Registry
            application. You can skip adding additional Officers but if you do not have one, you will not be able to
            access your newsroom contract if you lose access to your wallet.
          </OBSmallParagraph>
          <OBSmallParagraph>
            <strong>Member</strong> is standard role in the Newsroom Smart Contract. They have access to sign and
            publish posts on the blockchain using the Civil Publisher tool. They cannot add Civil Officers to a newsroom
            contract, but can add additional Members. If you lose your access to your wallet, a Civil Member does not
            have the option to add additional officers to the contract.
          </OBSmallParagraph>
          <OBSmallParagraph>
            <strong>None</strong> is a user role that has no access to your Newsroom Smart Contract but will still be
            listed on your Roster on the Civil Registry page. These may be contributors to your newsroom or notable
            board members or leadership that you see fit to add.
          </OBSmallParagraph>
        </OBCollapsable>
        <MemberUL>
          <MemberUlLabels>
            <MemberUlLabel>Name</MemberUlLabel>
            <MemberUlLabel>ETH Address</MemberUlLabel>
            <MemberUlLabel>Civil Role</MemberUlLabel>
            <MemberUlLabel>Status</MemberUlLabel>
          </MemberUlLabels>
          {members.map((member, index) => (
            <AddMember
              key={index}
              index={index}
              civil={this.context.civil!}
              newsroom={this.props.newsroom}
              name={member.name}
              avatarUrl={member.avatarUrl}
              memberAddress={member.ethAddress}
              notInCharter={member.notInCharter}
              updateCharter={this.props.updateCharter}
              charter={this.props.charter}
              profileWalletAddress={this.props.profileWalletAddress}
              forceCharterUpdateForMissingAddress={this.props.managerMode}
            />
          ))}
        </MemberUL>
        <OBSectionDescription>
          To add additional users, please{" "}
          {this.props.managerMode
            ? 'select the "Edit Charter" tab above'
            : 'use the links above to navigate back to the "Newsroom Roster" step'}{" "}
          and first add the user there. Make sure you have the user's ethereum wallet address on hand so that you can
          include it. Once you have {this.props.managerMode ? "published your updated charter" : "updated your charter"}
          , you can return here and assign them a role on your Newsroom Smart Contract.
        </OBSectionDescription>
      </>
    );
  }
}

const mapStateToProps = (state: StateWithNewsroom, ownProps: AddMembersToContractProps): AddMembersToContractProps => {
  const newsroomAddress = ownProps.newsroom ? ownProps.newsroom.address : "";
  const newsroom = state.newsrooms.get(newsroomAddress);
  const contractOwners = (newsroom.wrapper && newsroom.wrapper.data && newsroom.wrapper.data.owners) || [];
  const contractEditors = (newsroom.editors && newsroom.editors.toArray()) || [];

  const charterMemberAddresses = (ownProps.charter.roster || [])
    .filter(member => !!member.ethAddress)
    .map(member => member.ethAddress!.toLowerCase());
  const nonCharterOfficers = contractOwners.filter(
    address => charterMemberAddresses.indexOf(address.toLowerCase()) === -1,
  );
  const nonCharterEditors = contractEditors.filter(
    address => charterMemberAddresses.indexOf(address.toLowerCase()) === -1,
  );
  const nonCharterMembers = nonCharterOfficers.concat(nonCharterEditors);

  return {
    ...ownProps,
    nonCharterMembers,
  };
};

export const AddMembersToContract = connect(mapStateToProps)(AddMembersToContractComponent);
