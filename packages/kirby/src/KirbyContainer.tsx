import React from "react";
import { KirbyChildProvider, overrideTheme } from "@kirby-web3/child-react";
import { EthereumChildPlugin, SignatureInterceptorPlugin, IDToNetwork } from "@kirby-web3/plugin-ethereum";
import { ConnextChildPlugin } from "@kirby-web3/plugin-connext";
import { buildTrustedWebChildPlugin } from "@kirby-web3/plugin-trustedweb";

import { createGlobalStyle } from "styled-components";

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
    DEFAULT_ETHEREUM_NETWORK: string;
    KIRBY_ID_HUB_URI: string;
  };
}
export const KirbyContainer: React.FunctionComponent<KirbyAppProps> = ({ config, children }) => {
  const plugins = React.useMemo(() => {
    return [
      new ConnextChildPlugin({
        ethProviderUrl: "https://rinkeby.infura.io/v3/" + config.INFURA_APP_KEY,
        nodeUrl: "wss://rinkeby.indra.connext.network/api/messaging",
      }),
      new SignatureInterceptorPlugin({ autoSign: false }),
      buildTrustedWebChildPlugin(config.KIRBY_ID_HUB_URI, true),
      new EthereumChildPlugin({
        burnerPreference: "never",
        networks: {
          mainnet: "wss://mainnet.infura.io/ws/v3/" + config.INFURA_APP_KEY,
          rinkeby: "wss://rinkeby.infura.io/ws/v3/" + config.INFURA_APP_KEY,
        },
        defaultNetwork: IDToNetwork[parseInt(config.DEFAULT_ETHEREUM_NETWORK, 10)],
        portis: {
          appID: config.PORTIS_APP_ID,
        },
      }),
    ];
  }, [config]);

  return (
    <KirbyChildProvider plugins={plugins} theme={theme}>
      <GlobalStyle></GlobalStyle>
      {children}
    </KirbyChildProvider>
  );
};
