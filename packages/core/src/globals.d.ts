declare module "bn.js";

declare module "*.json" {
  const json: any;
  export default json;
}

declare module "web3/lib/solidity/coder" {
  const decodeParams: (types: string[], data: string) => any[];
}

//////////////////////
// Test definitions //
//////////////////////
declare module "dirty-chai";
declare module "chai-bignumber";

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
