import React from "react";
import { KirbyChildProvider, overrideTheme } from "@kirby-web3/child-react";
import { EthereumChildPlugin, SignatureInterceptorPlugin } from "@kirby-web3/plugin-ethereum";
import { ConnextChildPlugin } from "@kirby-web3/plugin-connext";

import { Viewport } from "./viewport/Viewport";
import { ReachRouterPlugin } from "./ReachRouterPlugin";
import { createGlobalStyle } from "styled-components";
import { CivilIDPlugin } from "./plugins/CivilID";

const GlobalStyle = createGlobalStyle`
.por_portis-widget-frame {
  top: 0 !important;
  bottom: auto !important;
}
 @media (max-width: 576px)  {
   .por_portis-widget-frame {
     top: 0 !important;
     bottom: auto !important;
   }
 }
`;

const theme = overrideTheme({
  headingFont: "Libre Franklin",
});

export interface KirbyAppProps {
  config: {
    INFURA_APP_KEY: string;
    PORTIS_APP_ID: string;
  };
}
const KirbyApp: React.FunctionComponent<KirbyAppProps> = ({ config }) => {
  console.log("loading kirby with config", config);
  const plugins = React.useMemo(() => {
    return [
      new ReachRouterPlugin(),
      new CivilIDPlugin(),
      new ConnextChildPlugin({
        ethProviderUrl: "https://rinkeby.infura.io/v3/" + config.INFURA_APP_KEY,
        nodeUrl: "wss://rinkeby.indra.connext.network/api/messaging",
      }),
      new SignatureInterceptorPlugin({ autoSign: false }),
      new EthereumChildPlugin({
        burnerPreference: "never",
        networks: {
          mainnet: "wss://mainnet.infura.io/ws/v3/" + config.INFURA_APP_KEY,
          rinkeby: "wss://rinkeby.infura.io/ws/v3/" + config.INFURA_APP_KEY,
        },
        defaultNetwork: "rinkeby",
        portis: {
          appID: config.PORTIS_APP_ID,
        },
      }),
    ];
  }, [config]);

  return (
    <KirbyChildProvider plugins={plugins} theme={theme}>
      <GlobalStyle></GlobalStyle>
      <Viewport />
    </KirbyChildProvider>
  );
};

export default KirbyApp;
