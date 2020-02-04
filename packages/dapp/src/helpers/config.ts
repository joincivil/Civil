export interface ConfigType {
  ENVIRONMENT?: string;
  MAINNET_GRAPHQL_URI?: string;
  RINKEBY_GRAPHQL_URI?: string;
  GANANCHE_GRAPHQL_URI?: string;
  DISCOURSE_URL?: string;
  DEFAULT_ETHEREUM_NETWORK?: string;
  SUPPORTED_ETHEREUM_NETWORKS?: string;
  SENDGRID_REGISTRY_LIST_ID?: string;
  INFURA_APP_KEY?: string;
  PORTIS_APP_ID?: string;
  FEATURE_FLAGS?: string;
  SENTRY_DSN?: string;
  STRIPE_CLIENT_ID?: string;
  STRIPE_API_KEY?: string;
  APP_VERSION?: string;
  KIRBY_TARGET_ORIGIN?: string;
  KIRBY_IFRAME_SRC?: string;
  KIRBY_ID_HUB_URI?: string;
}

const defaultConfig: ConfigType = {
  ENVIRONMENT: "development",
  MAINNET_GRAPHQL_URI: process.env.REACT_APP_MAINNET_GRAPHQL_URI,
  RINKEBY_GRAPHQL_URI: process.env.REACT_APP_RINKEBY_GRAPHQL_URI,
  GANANCHE_GRAPHQL_URI: process.env.REACT_APP_GANANCHE_GRAPHQL_URI,
  DISCOURSE_URL: process.env.REACT_APP_DISCOURSE_URL,
  DEFAULT_ETHEREUM_NETWORK: process.env.REACT_APP_DEFAULT_ETHEREUM_NETWORK,
  SUPPORTED_ETHEREUM_NETWORKS: process.env.REACT_APP_SUPPORTED_ETHEREUM_NETWORKS,
  SENDGRID_REGISTRY_LIST_ID: process.env.REACT_APP_SENDGRID_REGISTRY_LIST_ID,
  INFURA_APP_KEY: process.env.REACT_APP_INFURA_APP_KEY,
  PORTIS_APP_ID: process.env.REACT_APP_PORTIS_APP_ID,
  FEATURE_FLAGS: process.env.REACT_APP_FEATURE_FLAGS,
  SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN,
  STRIPE_CLIENT_ID: process.env.REACT_APP_STRIPE_CLIENT_ID,
  STRIPE_API_KEY: process.env.REACT_APP_STRIPE_API_KEY,
  APP_VERSION: process.env.REACT_APP_APP_VERSION,
  KIRBY_TARGET_ORIGIN: process.env.REACT_APP_KIRBY_TARGET_ORIGIN,
  KIRBY_IFRAME_SRC: process.env.REACT_APP_KIRBY_IFRAME_SRC,
  KIRBY_ID_HUB_URI: process.env.REACT_APP_KIRBY_ID_HUB_URI,
};

const serverConfigString = (window as any).SERVER_CONFIG;
let serverConfig = {};
if (serverConfigString !== "$ENVIRONMENT") {
  try {
    serverConfig = JSON.parse(serverConfigString);
  } catch (e) {
    console.log("error parsing server config: ", { serverConfigString, defaultConfig, e });
  }
}

const config: ConfigType = { ...defaultConfig, ...serverConfig };
console.log("configuration loaded", { config, defaultConfig, serverConfig });

export default config;
