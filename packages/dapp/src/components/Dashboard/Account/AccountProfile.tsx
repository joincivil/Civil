import * as React from "react";
import { CivilContext, ICivilContext } from "@joincivil/components";
import { AccountProfileTable, AccountUserInfoText } from "./AccountStyledComponents";
import { ProfileTitleText, AccountChangesSavedText } from "./AccountTextComponents";
import { AccountUserAvatar } from "./AccountUserAvatarUpdate";
import { AccountUserEmail } from "./AccountUserEmailUpdate";
import SetEmail from "../../Auth/SetEmail";
import SetAvatar from "../../Auth/SetAvatar";
import { UserManagementSection } from "../UserManagement";

export const AccountProfile: React.FunctionComponent = props => {
  const civilContext = React.useContext<ICivilContext>(CivilContext);
  const [shouldShowSetEmailModal, setShouldShowSetEmailModal] = React.useState(false);
  const [shouldShowSetAvatarModal, setShouldShowSetAvatarModal] = React.useState(false);
  const [shouldShowConfirmEmailWarning, setShouldShowConfirmEmailWarning] = React.useState(false);
  const [shouldShowSavedNotification, setShouldShowSavedNotification] = React.useState(false);
  const currentUser = civilContext.currentUser;

  if (currentUser) {
    return (
      <UserManagementSection
        showNotification={shouldShowSavedNotification}
        notificationText={<AccountChangesSavedText />}
        header={<ProfileTitleText />}
      >
        <AccountProfileTable>
          <tbody>
            <tr>
              <th>Profile picture</th>
              <td>
                <AccountUserAvatar
                  userHandle={currentUser.userChannel.handle}
                  userAvatarImgDataURL={currentUser.userChannel.avatarDataUrl}
                  onSetAvatarClicked={() => setShouldShowSetAvatarModal(true)}
                />
              </td>
            </tr>
            <tr>
              <th>Username</th>
              <td>
                <AccountUserInfoText>{currentUser.userChannel.handle}</AccountUserInfoText>
              </td>
            </tr>
            <tr>
              <th>Email address</th>
              <td>
                {shouldShowConfirmEmailWarning && (
                  <AccountUserInfoText>Please check your email to confirm address</AccountUserInfoText>
                )}
                <AccountUserEmail
                  userEmailAddress={currentUser.userChannel.EmailAddressRestricted}
                  onSetEmailClicked={() => setShouldShowSetEmailModal(true)}
                />
              </td>
            </tr>
          </tbody>
        </AccountProfileTable>
        {shouldShowSetEmailModal && (
          <SetEmail
            channelID={currentUser.userChannel.id}
            isProfileEdit={true}
            onSetEmailComplete={() => {
              setShouldShowSetEmailModal(false);
              setShouldShowConfirmEmailWarning(true);
              setShouldShowSavedNotification(true);
            }}
            onSetEmailCancelled={() => setShouldShowSetEmailModal(false)}
          />
        )}
        {shouldShowSetAvatarModal && (
          <SetAvatar
            channelID={currentUser.userChannel.id}
            isProfileEdit={true}
            onSetAvatarComplete={async () => {
              await civilContext.auth.handleInitialState();
              setShouldShowSetAvatarModal(false);
              setShouldShowSavedNotification(true);
            }}
            onSetAvatarCancelled={() => setShouldShowSetAvatarModal(false)}
          />
        )}
      </UserManagementSection>
    );
  }

  return <>Log in to view your Account</>;
};
