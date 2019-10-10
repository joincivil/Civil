import * as React from "react";
import { ApolloProvider } from "react-apollo";

import { INFURA_WEBSOCKET_HOSTS } from "@joincivil/ethapi";
import { getApolloClient } from "@joincivil/utils";
import { CivilProvider } from "@joincivil/components";

import { ErrorBoundry } from "../errors/ErrorBoundry";

import config from "../../helpers/config";

console.log("using config:", config);

const client = getApolloClient();

const pluginConfig = {
  dmz: {
    targetOrigin: config.KIRBY_TARGET_ORIGIN,
    iframeSrc: config.KIRBY_IFRAME_SRC,
  },
  ethereum: {
    defaultNetwork: config.DEFAULT_ETHEREUM_NETWORK === "1" ? "mainnet" : "rinkeby",
    networks: {
      mainnet: INFURA_WEBSOCKET_HOSTS.MAINNET + "/" + config.INFURA_APP_KEY,
      rinkeby: INFURA_WEBSOCKET_HOSTS.RINKEBY + "/" + config.INFURA_APP_KEY,
    },
  },
};

export const AppProvider: React.FunctionComponent = ({ children }) => {
  const featureFlags = config.FEATURE_FLAGS ? config.FEATURE_FLAGS.split(",") : [];

  return (
    <ErrorBoundry>
      <ApolloProvider client={client}>
        <CivilProvider pluginConfig={pluginConfig} featureFlags={featureFlags} config={config}>
          {children}
        </CivilProvider>
      </ApolloProvider>
    </ErrorBoundry>
  );
};

export default AppProvider;
