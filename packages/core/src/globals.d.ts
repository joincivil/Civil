declare module "bn.js";
declare module "ipfs-api";

declare module "*.json" {
  const json: any;
  export default json;
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
