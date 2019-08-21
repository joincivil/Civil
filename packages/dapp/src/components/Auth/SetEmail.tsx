import * as React from "react";
import { UserSetHandle, AuthApplicationEnum, AuthWrapper, AuthTextSetHandle, Modal } from "@joincivil/components";

const SetUsername: React.FunctionComponent = props => {
  return (
    <Modal width={588}>
      <UserSetHandle
        applicationType={AuthApplicationEnum.STOREFRONT}
        isNewUser={false}
        headerComponent={<AuthTextSetHandle />}
      />
    </Modal>
  );
};

export default SetUsername;
