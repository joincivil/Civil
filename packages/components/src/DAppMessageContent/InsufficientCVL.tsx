import * as React from "react";
import { InvertedButton, buttonSizes } from "../Button";
import { WarningIcon } from "../icons";
import {
  StyledErrorMessage,
  StyledBuyCVLButtonContainer,
  StyledMessageIconContainer,
  StyledMessageWithIconContainer,
} from "./styledComponents";
import { InsufficientCVLProps, BuyCVLButtonProps } from "./types";
import {
  InsufficientCVLForChallengeText,
  InsufficientCVLForAppealText,
  InsufficientCVLForAppealChallengeText,
} from "./textComponents";

export const InsufficientCVL: React.SFC<BuyCVLButtonProps> = props => {
  return (
    <StyledMessageWithIconContainer>
      <StyledMessageIconContainer>
        <WarningIcon />
      </StyledMessageIconContainer>
      <StyledErrorMessage>{props.children}</StyledErrorMessage>
      {props.buyCVLURL && (
        <StyledBuyCVLButtonContainer>
          <InvertedButton href={props.buyCVLURL} size={buttonSizes.MEDIUM}>
            Buy CVL
          </InvertedButton>
        </StyledBuyCVLButtonContainer>
      )}
    </StyledMessageWithIconContainer>
  );
};

export const InsufficientCVLForChallenge: React.SFC<InsufficientCVLProps & BuyCVLButtonProps> = props => {
  return (
    <InsufficientCVL buyCVLURL={props.buyCVLURL}>
      <InsufficientCVLForChallengeText minDeposit={props.minDeposit} />
    </InsufficientCVL>
  );
};

export const InsufficientCVLForAppeal: React.SFC<InsufficientCVLProps & BuyCVLButtonProps> = props => {
  return (
    <InsufficientCVL buyCVLURL={props.buyCVLURL}>
      <InsufficientCVLForAppealText minDeposit={props.minDeposit} />
    </InsufficientCVL>
  );
};

export const InsufficientCVLForAppealChallenge: React.SFC<InsufficientCVLProps & BuyCVLButtonProps> = props => {
  return (
    <InsufficientCVL buyCVLURL={props.buyCVLURL}>
      <InsufficientCVLForAppealChallengeText minDeposit={props.minDeposit} />
    </InsufficientCVL>
  );
};
