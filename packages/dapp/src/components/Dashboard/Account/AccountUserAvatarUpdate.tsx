import * as React from "react";
import {
  AccountAvatarImg,
  AccountNoAvatar,
  AccountAvatarContainer,
  AccountAvatarImgContainer,
} from "./AccountStyledComponents";
import { BorderlessButton, buttonSizes } from "@joincivil/elements";

export interface DashboardUserProfileSummaryProps {
  userAvatarImgDataURL: string;
  userHandle: string;
  onSetAvatarClicked(): void;
}

export const AccountUserAvatar = (props: DashboardUserProfileSummaryProps) => {
  const { userAvatarImgDataURL, userHandle, onSetAvatarClicked } = props;
  const initial = userHandle ? userHandle.charAt(0) : "?";
  return (
    <AccountAvatarContainer>
      {userAvatarImgDataURL && (
        <>
          <AccountAvatarImgContainer
            onClick={() => {
              onSetAvatarClicked();
            }}
          >
            <AccountAvatarImg src={userAvatarImgDataURL} />
          </AccountAvatarImgContainer>
          <BorderlessButton
            onClick={() => {
              onSetAvatarClicked();
            }}
            size={buttonSizes.SMALL}
          >
            Edit profile photo
          </BorderlessButton>
        </>
      )}
      {!userAvatarImgDataURL && (
        <>
          <AccountAvatarImgContainer
            onClick={() => {
              onSetAvatarClicked();
            }}
          >
            <AccountNoAvatar>{initial}</AccountNoAvatar>
          </AccountAvatarImgContainer>
          <BorderlessButton
            onClick={() => {
              onSetAvatarClicked();
            }}
            size={buttonSizes.SMALL}
          >
            Edit profile photo
          </BorderlessButton>
        </>
      )}
    </AccountAvatarContainer>
  );
};
