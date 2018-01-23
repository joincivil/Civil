import * as chaiAsPromised from "chai-as-promised";
import * as chaiBignumber from "chai-bignumber";
import * as dirtyChai from "dirty-chai";

export function configureChai(chai: any) {
  chai.config.includeStack = true;
  chai.use(chaiBignumber());
  chai.use(chaiAsPromised);
  chai.use(dirtyChai);
}
