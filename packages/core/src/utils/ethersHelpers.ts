import { ethers } from "ethers";

export interface EthersProviderResult {
  provider: ethers.providers.Provider;
  signer?: ethers.Signer;
}

export function makeEthersProvider(web3Provider: any, network: number): EthersProviderResult {
  const provider = new ethers.providers.Web3Provider(web3Provider, network === 1 ? "mainnet" : "rinkeby");
  const signer = provider.getSigner();
  return {
    provider,
    signer,
  };
}
