import * as React from "react";
import { StoryRegistryDetails } from "./StoryRegistryDetails";
import { urlConstants as links } from "@joincivil/utils";
import { CivilIcon } from "../icons";
import {
  RegistryStatusTag,
  StoryModalHeader,
  StoryModalContent,
  StoryNewsroomSection,
  StoryModalFooter,
  StoryRegistryLabel,
  StoryNewsroomName,
  StoryNewsroomURL,
  BlueLinkBtn,
  StoryETHAddress,
} from "./StoryFeedStyledComponents";
import { StoryNewsroomData } from "./types";

export interface StoryNewsroomDetailsProps {
  activeChallenge: boolean;
  newsroom: StoryNewsroomData;
}

export const StoryNewsroomDetails: React.FunctionComponent<StoryNewsroomDetailsProps> = props => {
  const { newsroom } = props;

  return (
    <>
      <StoryModalHeader>
        <StoryRegistryLabel>
          <CivilIcon width={42} height={11} /> Registry
        </StoryRegistryLabel>
        <StoryNewsroomName>{newsroom.charter.name}</StoryNewsroomName>
        <StoryNewsroomURL href={newsroom.charter.newsroomUrl} target="_blank">
          {newsroom.charter.newsroomUrl}
        </StoryNewsroomURL>
        {props.activeChallenge ? (
          <RegistryStatusTag activeChallenge={true}>Challenged</RegistryStatusTag>
        ) : (
          <RegistryStatusTag activeChallenge={false}>Approved</RegistryStatusTag>
        )}
      </StoryModalHeader>
      <StoryModalContent>
        <StoryRegistryDetails activeChallenge={props.activeChallenge} />
        <StoryNewsroomSection>
          <h2>About</h2>
          {newsroom.charter.mission.purpose}
        </StoryNewsroomSection>
        <StoryNewsroomSection>
          <h3>Smart Contract Address</h3>
          <StoryETHAddress>{newsroom.contractAddress}</StoryETHAddress>
        </StoryNewsroomSection>
        <StoryNewsroomSection>
          <h3>Public Wallet Address</h3>
          <StoryETHAddress>{newsroom.multisigAddress}</StoryETHAddress>
        </StoryNewsroomSection>
      </StoryModalContent>
      <StoryModalFooter>
        <BlueLinkBtn href={links.REGISTRY + newsroom.contractAddress} target="_blank">
          See Civil Registry Profile
        </BlueLinkBtn>
      </StoryModalFooter>
    </>
  );
};
