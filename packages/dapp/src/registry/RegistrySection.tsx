import * as React from "react";
import { GlobalNav } from "../components/GlobalNav";
import Main from "../components/Main";
import Footer from "../components/Footer";
import { ApolloProvider } from "react-apollo";
import { getApolloClient } from "@joincivil/utils";
import config from "../helpers/config";
import { standaloneRoutes } from "../constants";
import { ErrorBoundry } from "../components/errors/ErrorBoundry";

import { CivilProvider } from "@joincivil/components";
import { ConnectedRouter } from "connected-react-router";
import { Route, Switch } from "react-router-dom";

import { store, history } from "../redux/store";
import { CivilHelperProvider } from "../apis/CivilHelper";
import * as WSProvider from "web3-providers-ws";
import { INFURA_WEBSOCKET_HOSTS } from "@joincivil/ethapi";
import Web3 from "web3";
import { Web3AuthWrapper } from "../components/Web3AuthWrapper";

import { Provider } from "react-redux";

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

function makeLegacyWeb3(): any {
  let provider;
  if ((window as any).ethereum) {
    provider = (window as any).ethereum;
  } else {
    switch (config.DEFAULT_ETHEREUM_NETWORK!) {
      case "1":
        provider = new WSProvider(INFURA_WEBSOCKET_HOSTS.MAINNET + "/" + config.INFURA_APP_KEY);
        break;
      case "4":
        provider = new WSProvider(INFURA_WEBSOCKET_HOSTS.RINKEBY + "/" + config.INFURA_APP_KEY);
        break;
      default:
        provider = new WSProvider(INFURA_WEBSOCKET_HOSTS.RINKEBY + "/" + config.INFURA_APP_KEY);
        break;
    }
  }

  const web3 = new Web3(provider);
  return web3;
}

export class RegistrySection extends React.Component {
  private featureFlags: string[];
  public constructor(props: any) {
    super(props);
    this.featureFlags = config.FEATURE_FLAGS ? config.FEATURE_FLAGS.split(",") : [];
  }
  public render(): JSX.Element {
    return (
      <Provider store={store}>
        <ErrorBoundry>
          <ApolloProvider client={client}>
            <CivilProvider
              pluginConfig={pluginConfig}
              featureFlags={this.featureFlags}
              config={config}
              makeLegacyWeb3={makeLegacyWeb3}
            >
              <CivilHelperProvider>
                <ConnectedRouter history={history}>
                  <React.Suspense fallback={<></>}>
                    <Switch>
                      {standaloneRoutes.map((route: any) => (
                        <Route key={route.pathname} path={route.pathname} component={route.component} />
                      ))}
                      <Route>
                        <>
                          <Web3AuthWrapper />
                          <GlobalNav />
                          <Main />
                          <Footer />
                        </>
                      </Route>
                    </Switch>
                  </React.Suspense>
                </ConnectedRouter>
              </CivilHelperProvider>
            </CivilProvider>
          </ApolloProvider>
        </ErrorBoundry>
      </Provider>
    );
  }
}

export default RegistrySection;
