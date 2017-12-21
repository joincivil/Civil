declare module "dirty-chai";
declare module "chai-bignumber";
declare module "bn.js";

declare namespace Chai {
  interface Assertion {
    (message?: string): Assertion;
    bignumber: Assertion;
  }
  // dirty-chai and chai-as-promised working together
  interface PromisedAssertion {
    (message?: string): PromisedAssertion;
    bignumber: PromisedAssertion;
  }
}

// Injected by truffle
declare var artifacts: { require: (name: string) => any };
declare var contract: (contractName: string, tests: (accounts: string[]) => void) => void;
declare var describe: (functionName: string, tests: () => void) => void;
declare var it: (description: string, test: () => void) => void;
declare var before: (func: () => void) => void;
declare var beforeEach: (func: () => void) => void;
declare var web3: any;
