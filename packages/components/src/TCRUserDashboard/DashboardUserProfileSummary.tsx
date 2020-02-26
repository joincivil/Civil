import * as React from "react";
import {
  StyledUserProfile,
  StyledUserHandleAndEmailContainer,
  StyledUserAvatar,
  StyledEditAvatar,
  StyledUserHandleText,
  StyledUserEmailText,
  StyledUserSetEmailText,
  StyledChangeUserEmailText,
  StyledUserNoAvatar,
  StyledAvatarContainer,
  StyledEditSpan,
} from "./DashboardStyledComponents";
import { InvertedButton, buttonSizes } from "@joincivil/elements";

export interface DashboardUserProfileSummaryProps {
  userAvatarImgDataURL: string;
  userHandle: string;
  userEmailAddress: string;
  onSetEmailClicked(): void;
  onSetAvatarClicked(): void;
}

export const DashboardUserProfileSummary = (props: DashboardUserProfileSummaryProps) => {
  const { userAvatarImgDataURL, userHandle, userEmailAddress, onSetEmailClicked, onSetAvatarClicked } = props;
  const initial = userHandle ? userHandle.charAt(0) : "?";
  return (
    <StyledUserProfile>
      {userAvatarImgDataURL && (
        <StyledAvatarContainer
          onClick={() => {
            onSetAvatarClicked();
          }}
        >
          <StyledUserAvatar src={userAvatarImgDataURL} />
          <StyledEditAvatar></StyledEditAvatar>
          <StyledEditSpan>Edit</StyledEditSpan>
        </StyledAvatarContainer>
      )}
      {!userAvatarImgDataURL && (
        <StyledAvatarContainer
          onClick={() => {
            onSetAvatarClicked();
          }}
        >
          <StyledUserNoAvatar>{initial}</StyledUserNoAvatar>
          <StyledEditAvatar></StyledEditAvatar>
          <StyledEditSpan>Edit</StyledEditSpan>
        </StyledAvatarContainer>
      )}
      <StyledUserHandleAndEmailContainer>
        <StyledUserHandleText>{userHandle}</StyledUserHandleText>
        {userEmailAddress && <StyledUserEmailText>{userEmailAddress}</StyledUserEmailText>}
        {userEmailAddress && (
          <StyledChangeUserEmailText
            onClick={() => {
              onSetEmailClicked();
            }}
          >
            change email
          </StyledChangeUserEmailText>
        )}
        {!userEmailAddress && (
          <StyledUserSetEmailText
            onClick={() => {
              onSetEmailClicked();
            }}
          >
            set email
          </StyledUserSetEmailText>
        )}
        <InvertedButton  size={buttonSizes.SMALL} to={"/account"}>
          Edit Account
        </InvertedButton>
      </StyledUserHandleAndEmailContainer>
    </StyledUserProfile>
  );
};
