declare function toSnakeCase(str: string): string;
declare module 'to-snake-case' {
    export = toSnakeCase;
}

// Testing
declare module "bn.js";
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
