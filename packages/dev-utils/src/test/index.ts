import * as chaiAsPromised from "chai-as-promised";
import * as chaiBignumber from "chai-bignumber";
import * as dirtyChai from "dirty-chai";
import * as Web3 from "web3";

export function configureChai(chai: any): void {
  chai.config.includeStack = true;
  chai.use(chaiBignumber());
  chai.use(chaiAsPromised);
  chai.use(dirtyChai);
}

// TODO(ritave): Create a mock provider
export function dummyWeb3Provider(): Web3.Provider {
  return new Web3.providers.HttpProvider("http://localhost:8545");
}
