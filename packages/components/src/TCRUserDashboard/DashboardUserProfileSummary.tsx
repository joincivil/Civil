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
  StyledUserEmailContainer,
  StyledUserNoAvatar,
  StyledChangeUserAvatarText,
  StyledAvatarContainer,
  StyledEditSpan,
} from "./DashboardStyledComponents";

export interface DashboardUserProfileSummaryProps {
  userAvatarImgDataURL: string;
  userHandle: string;
  userEmailAddress: string;
  onSetEmailClicked(): void;
  onSetAvatarClicked(): void;
}

export const DashboardUserProfileSummary = (props: DashboardUserProfileSummaryProps) => {
  const { userAvatarImgDataURL, userHandle, userEmailAddress, onSetEmailClicked, onSetAvatarClicked } = props;

  const setAvatarText = userAvatarImgDataURL ? "change avatar" : "set avatar";
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
          <StyledUserNoAvatar />
          <StyledEditAvatar>Edit</StyledEditAvatar>
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
      </StyledUserHandleAndEmailContainer>
    </StyledUserProfile>
  );
};
