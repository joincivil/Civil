import * as React from "react";
import {
  StyledUserProfile,
  StyledUserHandleAndEmailContainer,
  StyledUserAvatar,
  StyledUserHandleText,
  StyledUserEmailText,
  StyledUserNoAvatar,
  StyledAvatarContainer,
} from "./DashboardStyledComponents";

export interface DashboardUserProfileSummaryProps {
  userAvatarImgDataURL: string;
  userHandle: string;
  userEmailAddress: string;
}

export const DashboardUserProfileSummary = (props: DashboardUserProfileSummaryProps) => {
  const {
    userAvatarImgDataURL,
    userHandle,
    userEmailAddress,
  } = props;
  const initial = userHandle ? userHandle.charAt(0) : "?";
  return (
    <StyledUserProfile>
      {userAvatarImgDataURL && (
        <StyledAvatarContainer>
          <StyledUserAvatar src={userAvatarImgDataURL} />
        </StyledAvatarContainer>
      )}
      {!userAvatarImgDataURL && (
        <StyledAvatarContainer>
          <StyledUserNoAvatar>{initial}</StyledUserNoAvatar>
        </StyledAvatarContainer>
      )}
      <StyledUserHandleAndEmailContainer>
        <StyledUserHandleText>{userHandle}</StyledUserHandleText>
        {userEmailAddress && <StyledUserEmailText>{userEmailAddress}</StyledUserEmailText>}
      </StyledUserHandleAndEmailContainer>
    </StyledUserProfile>
  );
};
