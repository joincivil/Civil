declare module "bn.js";

declare module "*.json" {
  const json: any;
  export default json;
}

declare module 'web3/lib/solidity/coder' {
  const decodeParams: (types: string[], data: string) => any[];
}
