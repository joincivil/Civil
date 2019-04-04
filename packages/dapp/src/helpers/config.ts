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
  FEATURE_FLAGS?: string;
  SENTRY_DSN?: string;
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
  FEATURE_FLAGS: process.env.REACT_APP_FEATURE_FLAGS,
  SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN,
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
