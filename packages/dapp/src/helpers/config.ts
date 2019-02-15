export interface ConfigType {
  MAINNET_GRAPHQL_URI?: string;
  RINKEBY_GRAPHQL_URI?: string;
  GANANCHE_GRAPHQL_URI?: string;
  DISCOURSE_URL?: string;
}

const defaultConfig: ConfigType = {
  MAINNET_GRAPHQL_URI: process.env.REACT_APP_MAINNET_GRAPHQL_URI,
  RINKEBY_GRAPHQL_URI: process.env.REACT_APP_RINKEBY_GRAPHQL_URI,
  GANANCHE_GRAPHQL_URI: process.env.REACT_APP_GANANCHE_GRAPHQL_URI,
  DISCOURSE_URL: process.env.REACT_APP_DISCOURSE_URL,
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
