import { ethers } from "ethers";
import { detectProvider } from "@joincivil/ethapi";

export interface EthersProviderResult {
  provider: ethers.providers.Provider;
  signer?: ethers.Signer;
  network: number;
}
export function makeEthersProvider(defaultNetwork: string): EthersProviderResult {
  const web3Provider = detectProvider();

  if (web3Provider) {
    const provider = new ethers.providers.Web3Provider(web3Provider);
    const signer = provider.getSigner();
    let network = Number.parseInt((web3Provider as any).networkVersion as string, 10);
    if (isNaN(network)) {
      console.error("error parsing network", (web3Provider as any).networkVersion);
      network = 1;
    }
    return {
      provider,
      signer,
      network,
    };
  } else {
    console.warn("using read only ethers provider");
    if (defaultNetwork === "1") {
      return { network: 1, provider: new ethers.providers.InfuraProvider("mainnet") };
    } else {
      return { network: 4, provider: new ethers.providers.InfuraProvider("rinkeby") };
    }
  }
}
