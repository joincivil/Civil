import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as chaiBignumber from "chai-bignumber";
import * as dirtyChai from "dirty-chai";

export default () => {
  chai.config.includeStack = true;
  chai.use(chaiBignumber());
  chai.use(chaiAsPromised);
  chai.use(dirtyChai);
};
