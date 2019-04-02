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

export const InsufficientCVL: React.FunctionComponent<BuyCVLButtonProps> = props => {
  const { buyCVLURL } = props;
  let buyBtnProps: any = { href: buyCVLURL };
  if (buyCVLURL.charAt(0) === "/") {
    buyBtnProps = { to: buyCVLURL };
  }
  return (
    <StyledMessageWithIconContainer>
      <StyledMessageIconContainer>
        <WarningIcon />
      </StyledMessageIconContainer>
      <StyledErrorMessage>{props.children}</StyledErrorMessage>
      {props.buyCVLURL && (
        <StyledBuyCVLButtonContainer>
          <InvertedButton {...buyBtnProps} size={buttonSizes.MEDIUM}>
            Buy CVL
          </InvertedButton>
        </StyledBuyCVLButtonContainer>
      )}
    </StyledMessageWithIconContainer>
  );
};

export const InsufficientCVLForChallenge: React.FunctionComponent<InsufficientCVLProps & BuyCVLButtonProps> = props => {
  return (
    <InsufficientCVL buyCVLURL={props.buyCVLURL}>
      <InsufficientCVLForChallengeText minDeposit={props.minDeposit} />
    </InsufficientCVL>
  );
};

export const InsufficientCVLForAppeal: React.FunctionComponent<InsufficientCVLProps & BuyCVLButtonProps> = props => {
  return (
    <InsufficientCVL buyCVLURL={props.buyCVLURL}>
      <InsufficientCVLForAppealText appealFee={props.appealFee} />
    </InsufficientCVL>
  );
};

export const InsufficientCVLForAppealChallenge: React.FunctionComponent<
  InsufficientCVLProps & BuyCVLButtonProps
> = props => {
  return (
    <InsufficientCVL buyCVLURL={props.buyCVLURL}>
      <InsufficientCVLForAppealChallengeText appealFee={props.appealFee} />
    </InsufficientCVL>
  );
};
