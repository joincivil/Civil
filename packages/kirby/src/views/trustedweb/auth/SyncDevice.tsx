import * as React from "react";
import styled from "styled-components";
import { BorderlessButton } from "@joincivil/elements";
import QRCode from "qrcode.react";

const Entropy = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
`;

export interface SyncDeviceProps {
  entropy: string;
  cancel(): void;
}
export const SyncDevice: React.FunctionComponent<SyncDeviceProps> = ({ entropy, cancel }) => {
  return (
    <div>
      <BorderlessButton onClick={cancel}>&lt; Back</BorderlessButton>
      <h3>Sync Device</h3>
      <div>Choose "sync from another device" from the login screen of your device. And scan the QR Code.</div>
      <Entropy>
        <QRCode value={entropy} />
      </Entropy>
    </div>
  );
};
