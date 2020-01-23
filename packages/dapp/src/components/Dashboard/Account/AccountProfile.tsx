import * as React from "react";
import { CivilContext, ICivilContext } from "@joincivil/components";
import {
  AccountSectionWrap,
  AccountSectionHeader,
  AccountProfileTable,
  AccountUserInfoText,
} from "./AccountStyledComponents";
import { ProfileTitleText } from "./AccountTextComponents";
import { AccountUserAvatar } from "./AccountUserAvatarUpdate";
import { AccountUserEmail } from "./AccountUserEmailUpdate";
import SetEmail from "../../Auth/SetEmail";
import SetAvatar from "../../Auth/SetAvatar";

export const AccountProfile: React.FunctionComponent = props => {
  const civilContext = React.useContext<ICivilContext>(CivilContext);
  const [shouldShowSetEmailModal, setShouldShowSetEmailModal] = React.useState(false);
  const [shouldShowSetAvatarModal, setShouldShowSetAvatarModal] = React.useState(false);
  const [shouldShowConfirmEmailWarning, setShouldShowConfirmEmailWarning] = React.useState(false);
  const currentUser = civilContext.currentUser;

  if (currentUser) {
    return (
      <AccountSectionWrap>
        <AccountSectionHeader>
          <ProfileTitleText />
        </AccountSectionHeader>
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
                {currentUser.userChannel.EmailAddressRestricted}
                <AccountUserEmail
                  userEmailAddress={currentUser.userChannel.EmailAddressRestricted}
                  onSetEmailClicked={() => setShouldShowSetEmailModal(true)}
                />
                {shouldShowConfirmEmailWarning && <>Please check your email to confirm address</>}
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
            }}
            onSetAvatarCancelled={() => setShouldShowSetAvatarModal(false)}
          />
        )}
      </AccountSectionWrap>
    );
  }

  return <>Log in to view your Account</>;
};
