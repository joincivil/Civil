import { DashboardUserProfileSummary } from "@joincivil/components";
import * as React from "react";
import { routes } from "../../constants";

const UserProfileSummary = (props: any) => {
  const { user, onSetEmailClicked, onSetAvatarClicked } = props;

  if (!user) {
    console.error("User not found in UserProfileSummary");
    return <></>;
  }
  const { userChannel } = user;
  if (!userChannel) {
    console.error("User Channel not found in UserProfileSummary");
    return <></>;
  }

  const userAvatarImgDataURL = userChannel.avatarDataUrl;
  const userHandle = userChannel.handle;
  const userEmailAddress = userChannel.EmailAddressRestricted;

  const componentProps = {
    userAvatarImgDataURL,
    userHandle,
    userEmailAddress,
    onSetEmailClicked,
    onSetAvatarClicked,
    accountURL: routes.ACCOUNT_ROOT,
  };
  return <DashboardUserProfileSummary {...componentProps} />;
};

export default UserProfileSummary;
