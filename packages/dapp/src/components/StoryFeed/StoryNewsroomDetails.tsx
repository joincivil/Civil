import * as React from "react";
import { StoryRegistryDetails } from "./StoryRegistryDetails";
import { urlConstants as links } from "@joincivil/utils";
import { CivilIcon } from "@joincivil/elements";
import {
  RegistryStatusTag,
  StoryDetailsHeader,
  StoryDetailsContent,
  StoryNewsroomSection,
  StoryDetailsFooter,
  StoryRegistryLabel,
  StoryNewsroomName,
  StoryNewsroomURL,
  BlueLinkBtn,
  StoryETHAddress,
  StoryDetailsFlex,
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
      <StoryDetailsHeader>
        <StoryRegistryLabel>
          <CivilIcon width={42} height={11} /> Registry
        </StoryRegistryLabel>
        <StoryDetailsFlex>
          <div>
            <StoryNewsroomName>{newsroom.name}</StoryNewsroomName>
            <StoryNewsroomURL href={newsroom.charter.newsroomUrl} target="_blank">
              {newsroom.charter.newsroomUrl}
            </StoryNewsroomURL>
          </div>
          {props.activeChallenge ? (
            <RegistryStatusTag activeChallenge={true}>Challenged</RegistryStatusTag>
          ) : (
            <RegistryStatusTag activeChallenge={false}>Approved</RegistryStatusTag>
          )}
        </StoryDetailsFlex>
      </StoryDetailsHeader>
      <StoryDetailsContent>
        <StoryRegistryDetails activeChallenge={props.activeChallenge} />
        <StoryNewsroomSection>
          <h2>About</h2>
          <p>{newsroom.charter.mission.purpose}</p>
        </StoryNewsroomSection>
        <StoryNewsroomSection>
          <h3>Smart Contract Address</h3>
          <StoryETHAddress>{newsroom.contractAddress}</StoryETHAddress>
        </StoryNewsroomSection>
        <StoryNewsroomSection>
          <h3>Public Wallet Address</h3>
          <StoryETHAddress>{newsroom.multisigAddress}</StoryETHAddress>
        </StoryNewsroomSection>
      </StoryDetailsContent>
      <StoryDetailsFooter>
        <BlueLinkBtn href={links.REGISTRY + "listing/" + newsroom.contractAddress} target="_blank">
          View on Civil Registry
        </BlueLinkBtn>
      </StoryDetailsFooter>
    </>
  );
};
