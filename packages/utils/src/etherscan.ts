export function getEtherscanBaseURL(network: string | number): string | undefined {
  let networkKey = network;
  if (typeof networkKey === "string") {
    networkKey = parseInt(networkKey, 10);
  }

  const etherscanBaseURLs: { [index: number]: string } = {
    1: "https://etherscan.io",
    4: "https://rinkeby.etherscan.io",
    // 50: undefined,
  };

  return etherscanBaseURLs[networkKey];
}
