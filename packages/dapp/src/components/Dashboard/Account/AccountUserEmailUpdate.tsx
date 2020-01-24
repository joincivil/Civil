import * as React from "react";
import { AccountUserInfoText } from "./AccountStyledComponents";
import { BorderlessButton, buttonSizes } from "@joincivil/elements";

export interface AccountUserEmailProps {
  userEmailAddress: string;
  onSetEmailClicked(): void;
}

export const AccountUserEmail = (props: AccountUserEmailProps) => {
  const { userEmailAddress, onSetEmailClicked } = props;
  return (
    <>
      {userEmailAddress && <AccountUserInfoText>{userEmailAddress}</AccountUserInfoText>}
      {userEmailAddress && (
        <BorderlessButton
          onClick={() => {
            onSetEmailClicked();
          }}
          size={buttonSizes.SMALL}
        >
          Change email
        </BorderlessButton>
      )}
      {!userEmailAddress && (
        <BorderlessButton
          onClick={() => {
            onSetEmailClicked();
          }}
          size={buttonSizes.SMALL}
        >
          Set email
        </BorderlessButton>
      )}
    </>
  );
};
