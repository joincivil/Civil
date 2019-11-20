import * as React from "react";
import { Modal, UserSetEmail } from "@joincivil/components";

interface SetUsernameProps {
  channelID: string;
  isProfileEdit?: boolean; // true if component is displayed via profile edit flow (as opposed to sign up flow)
  onSetEmailComplete?(): void;
  onSetEmailCancelled?(): void;
}
const SetEmail: React.FunctionComponent<SetUsernameProps> = props => {
  return (
    <Modal width={588}>
      <UserSetEmail {...props} />
    </Modal>
  );
};

export default SetEmail;
