import * as React from "react";
import { WalletSelector } from "./WalletSelector";
import { FullScreenModal } from "./FullscreenModal";

export class WalletSelectorModal extends React.Component {
  public render(): JSX.Element {
    return (
      <FullScreenModal open={true}>
        <WalletSelector network={4} />
      </FullScreenModal>
    );
  }
}
