import * as React from "react";
import { StoryRegistryDetails } from "./StoryRegistryDetails";
import { ChallengedTag, ApprovedTag } from "./StoryFeedStyledComponents";

export interface StoryNewsroomDetailsProps {
  activeChallenge: boolean;
  contractAddress: string;
  multisigAddress: string;
  newsroom: string;
  newsroomAbout: string;
  newsroomURL: string;
}

export const StoryNewsroomDetails: React.FunctionComponent<StoryNewsroomDetailsProps> = props => {
  return (
    <>
      <>
        <>
          <span>{props.newsroom}</span>
          <span>{props.newsroomURL}</span>
        </>
        <>
          <span>Civil Registry</span>
          {props.activeChallenge ? <ChallengedTag /> : <ApprovedTag />}
        </>
      </>
      <StoryRegistryDetails activeChallenge={props.activeChallenge} />
      <>
        <>About</>
        {props.newsroomAbout}
      </>
      <>
        <>Smart Contract Address</>
        <>{props.contractAddress}</>
      </>
      <>
        <>Public Wallet Address</>
        <>{props.multisigAddress}</>
      </>
    </>
  );
};
