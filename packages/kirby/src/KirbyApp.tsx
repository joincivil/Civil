import React from "react";

import { Viewport } from "./viewport/Viewport";
import { KirbyContainer } from "./KirbyContainer";

export interface KirbyAppProps {
  config: {
    INFURA_APP_KEY: string;
    PORTIS_APP_ID: string;
    DEFAULT_ETHEREUM_NETWORK: string;
    KIRBY_ID_HUB_URI: string;
  };
}

const KirbyApp: React.FunctionComponent<KirbyAppProps> = ({ config }) => {
  return (
    <KirbyContainer config={config}>
      <Viewport />
    </KirbyContainer>
  );
};

export default KirbyApp;
