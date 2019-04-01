import * as React from "react";
import { InsufficientCVLProps } from "./types";

export const InsufficientCVLForChallengeText: React.FunctionComponent<InsufficientCVLProps> = props => {
  return (
    <>
      Sorry, you don’t have enough CVL tokens to challenge this newsroom. A deposit of {props.minDeposit} tokens is
      required to challenge newsrooms.
    </>
  );
};

export const InsufficientCVLForAppealText: React.FunctionComponent<InsufficientCVLProps> = props => {
  return (
    <>
      Sorry, you don’t have enough CVL tokens to request an appeal. A deposit of {props.minDeposit} tokens is required
      to submit an appeal request.
    </>
  );
};

export const InsufficientCVLForAppealChallengeText: React.FunctionComponent<InsufficientCVLProps> = props => {
  return (
    <>
      Sorry, you don’t have enough CVL tokens to challenge this granted appeal. A deposit of {props.minDeposit} tokens
      is required to challenge a granted appeal.
    </>
  );
};
