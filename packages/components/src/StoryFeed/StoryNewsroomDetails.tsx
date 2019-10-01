import * as React from "react";
import { StoryRegistryDetails } from "./StoryRegistryDetails";
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

export interface StoryNewsroomDetailsProps {
  activeChallenge: boolean;
  contractAddress: string;
  multisigAddress: string;
  newsroom: string;
  newsroomAbout: string;
  newsroomURL: string;
  newsroomRegistryURL: string;
}

export const StoryNewsroomDetails: React.FunctionComponent<StoryNewsroomDetailsProps> = props => {
  return (
    <>
      <StoryModalHeader>
        <StoryRegistryLabel>
          <CivilIcon width={42} height={11} /> Registry
        </StoryRegistryLabel>
        <StoryNewsroomName>{props.newsroom}</StoryNewsroomName>
        <StoryNewsroomURL href={props.newsroomURL} target="_blank">
          {props.newsroomURL}
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
          {props.newsroomAbout}
        </StoryNewsroomSection>
        <StoryNewsroomSection>
          <h3>Smart Contract Address</h3>
          <StoryETHAddress>{props.contractAddress}</StoryETHAddress>
        </StoryNewsroomSection>
        <StoryNewsroomSection>
          <h3>Public Wallet Address</h3>
          <StoryETHAddress>{props.multisigAddress}</StoryETHAddress>
        </StoryNewsroomSection>
      </StoryModalContent>
      <StoryModalFooter>
        <BlueLinkBtn href={props.newsroomRegistryURL} target="_blank">
          See Civil Registry Profile
        </BlueLinkBtn>
      </StoryModalFooter>
    </>
  );
};
