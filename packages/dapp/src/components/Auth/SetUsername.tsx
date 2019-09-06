import * as React from "react";
import { UserSetHandle, AuthApplicationEnum, AuthTextSetHandle, Modal } from "@joincivil/components";

interface SetUsernameProps {
  channelID: string;
}
const SetUsername: React.FunctionComponent<SetUsernameProps> = props => {
  console.log("SetUsername props: ", props);
  return (
    <Modal width={588}>
      <UserSetHandle
        {...props}
        applicationType={AuthApplicationEnum.STOREFRONT}
        isNewUser={false}
        headerComponent={<AuthTextSetHandle />}
      />
    </Modal>
  );
};

export default SetUsername;
