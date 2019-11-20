import { DashboardUserProfileSummary } from "@joincivil/components";
import * as React from "react";

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
  };
  return <DashboardUserProfileSummary {...componentProps} />;
};

export default UserProfileSummary;
