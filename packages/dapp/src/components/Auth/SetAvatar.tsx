import * as React from "react";
import { UserSetAvatar, AuthTextSetAvatar, Modal } from "@joincivil/components";

interface SetAvatarProps {
  channelID: string;
  isProfileEdit?: boolean; // true if component is displayed via profile edit flow (as opposed to sign up flow)
  onSetAvatarComplete?(): void;
  onSetAvatarCancelled?(): void;
}
const SetAvatar: React.FunctionComponent<SetAvatarProps> = props => {
  return (
    <Modal width={588}>
      <UserSetAvatar {...props} headerComponent={<AuthTextSetAvatar />} />
    </Modal>
  );
};

export default SetAvatar;
