import * as React from "react";
import { CivilStatusInfo } from "./StoryfeedStyledComponents";

export interface StoryNewsroomCardProps {
  activeChallenge: boolean;
  contractAddress: string;
  multisigAddress: string;
  newsroom: string;
  newsroomAbout: string;
  newsroomURL: string;
}

export const StoryNewsroomCard: React.FunctionComponent<StoryNewsroomCardProps> = props => {
  return (
    <>
      <>
        <>
          <span>{props.newsroom}</span>
          <span>{props.newsroomURL}</span>
        </>
        <>
          <span>Civil Registry</span>
          {props.activeChallenge ? <span>Challenged</span> : <span>Approved</span>}
        </>
      </>
      <CivilStatusInfo>
        <p></p>
      </CivilStatusInfo>
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
