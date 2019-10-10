import * as React from "react";
import { Modal, UserSetEmail } from "@joincivil/components";

interface SetUsernameProps {
  channelID: string;
  onSetEmailComplete?(): void;
}
const SetEmail: React.FunctionComponent<SetUsernameProps> = props => {
  return (
    <Modal width={588}>
      <UserSetEmail {...props} />
    </Modal>
  );
};

export default SetEmail;
