import * as React from "react";
import { WalletSelector } from "./WalletSelector";
import { FullscreenModal } from "./FullscreenModal";

export class WalletSelectorModal extends React.Component {
  public render(): JSX.Element {
    return (
      <FullscreenModal>
        <WalletSelector network={4} />
      </FullscreenModal>
    );
  }
}
