import * as React from "react";
import {
  StyledUserProfile,
  StyledUserHandleAndEmailContainer,
  StyledUserAvatar,
  StyledUserHandleText,
  StyledUserEmailText,
  StyledUserSetEmailText,
  StyledChangeUserEmailText,
  StyledUserEmailContainer,
  StyledUserNoAvatar,
  StyledChangeUserAvatarText,
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
        <StyledUserAvatar
          src={userAvatarImgDataURL}
          onClick={() => {
            onSetAvatarClicked();
          }}
        />
      )}
      {!userAvatarImgDataURL && (
        <StyledUserNoAvatar
          onClick={() => {
            onSetAvatarClicked();
          }}
        />
      )}
      <StyledUserHandleAndEmailContainer>
        <StyledUserHandleText>{userHandle}</StyledUserHandleText>
        {userEmailAddress && (
          <StyledUserEmailContainer>
            <StyledUserEmailText>{userEmailAddress}</StyledUserEmailText>
            <StyledChangeUserEmailText
              onClick={() => {
                onSetEmailClicked();
              }}
            >
              change
            </StyledChangeUserEmailText>
          </StyledUserEmailContainer>
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
        <StyledChangeUserAvatarText
          onClick={() => {
            onSetAvatarClicked();
          }}
        >
          {setAvatarText}
        </StyledChangeUserAvatarText>
      </StyledUserHandleAndEmailContainer>
    </StyledUserProfile>
  );
};
