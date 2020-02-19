import * as React from "react";
import { CivilContext, ICivilContext, colors } from "@joincivil/components";
import { CloseXIcon } from "@joincivil/elements";
import {
  AccountSectionWrap,
  AccountSectionHeader,
  AccountProfileTable,
  AccountUserInfoText,
  AccountChangesSavedMessage,
  AccountMessegeClose,
} from "./AccountStyledComponents";
import { ProfileTitleText, AccountChangesSavedText } from "./AccountTextComponents";
import { AccountUserAvatar } from "./AccountUserAvatarUpdate";
import { AccountUserEmail } from "./AccountUserEmailUpdate";
import SetEmail from "../../Auth/SetEmail";
import SetAvatar from "../../Auth/SetAvatar";

export const AccountProfile: React.FunctionComponent = props => {
  const civilContext = React.useContext<ICivilContext>(CivilContext);
  const [shouldShowSetEmailModal, setShouldShowSetEmailModal] = React.useState(false);
  const [shouldShowSetAvatarModal, setShouldShowSetAvatarModal] = React.useState(false);
  const [shouldShowConfirmEmailWarning, setShouldShowConfirmEmailWarning] = React.useState(false);
  const [shouldShowSavedConfirmation, setShouldShowSavedConfirmation] = React.useState(false);
  const currentUser = civilContext.currentUser;

  console.log("currentUser: ", currentUser);

  if (currentUser) {
    return (
      <AccountSectionWrap>
        {shouldShowSavedConfirmation && (
          <AccountChangesSavedMessage>
            <AccountChangesSavedText />
            <AccountMessegeClose onClick={() => setShouldShowSavedConfirmation(false)}>
              <CloseXIcon color={colors.accent.CIVIL_GRAY_0} />
            </AccountMessegeClose>
          </AccountChangesSavedMessage>
        )}
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
              setShouldShowSavedConfirmation(true);
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
              setShouldShowSavedConfirmation(true);
            }}
            onSetAvatarCancelled={() => setShouldShowSetAvatarModal(false)}
          />
        )}
      </AccountSectionWrap>
    );
  }

  return <>Log in to view your Account</>;
};
