import config from "./config";

export const supportedNetworks: number[] = config.SUPPORTED_ETHEREUM_NETWORKS
  ? config.SUPPORTED_ETHEREUM_NETWORKS.split(",").map(num => {
      return parseInt(num, 10);
    })
  : [];

export const formattedNetworkNames: { [index: string]: string } = {
  1: "Main Ethereum Network",
  4: "Rinkeby Test Network",
  50: "Localhost 8545",
};

export function getFormattedNetworkNames(networkIDs: number[]): string[] {
  return networkIDs.map(id => {
    return formattedNetworkNames[id.toString()];
  });
}

export function isNetworkSupported(network: string | number): boolean {
  let networkKey = network;
  if (typeof networkKey === "string") {
    networkKey = parseInt(networkKey, 10);
  }
  return supportedNetworks.includes(networkKey);
}

export const isGraphQLSupportedOnNetwork = (network: number): boolean => {
  return supportedNetworks.includes(network);
};
