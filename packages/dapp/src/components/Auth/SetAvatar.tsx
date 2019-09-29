import * as React from "react";
import { UserSetAvatar, AuthTextSetAvatar, Modal } from "@joincivil/components";

interface SetAvatarProps {
  channelID: string;
  onSetAvatarComplete?(): void;
}
const SetAvatar: React.FunctionComponent<SetAvatarProps> = props => {
  return (
    <Modal width={588}>
      <UserSetAvatar
        {...props}
        headerComponent={<AuthTextSetAvatar />}
        onSetAvatarComplete={props.onSetAvatarComplete}
      />
    </Modal>
  );
};

export default SetAvatar;
