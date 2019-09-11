import * as React from "react";
import { UserSetHandle, AuthApplicationEnum, AuthTextSetHandle, Modal } from "@joincivil/components";

interface SetUsernameProps {
  channelID: string;
  onSetHandleComplete?(): void;
}
const SetUsername: React.FunctionComponent<SetUsernameProps> = props => {
  return (
    <Modal width={588}>
      <UserSetHandle
        {...props}
        applicationType={AuthApplicationEnum.STOREFRONT}
        isNewUser={false}
        headerComponent={<AuthTextSetHandle />}
        onSetHandleComplete={props.onSetHandleComplete}
      />
    </Modal>
  );
};

export default SetUsername;
