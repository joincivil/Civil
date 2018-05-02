import * as chai from "chai";
import { configureChai } from "@joincivil/dev-utils";

import { REVERTED } from "../../utils/constants";
import * as utils from "../../utils/contractutils";
configureChai(chai);
const expect = chai.expect;

contract("Government", accounts => {
  describe("Function: setAppellate", () => {
    const [JAB, troll, newAppellate] = accounts;
    let registry: any;
    beforeEach(async () => {
      registry = await utils.createAllCivilTCRInstance(accounts, JAB);
    });

    it("should be possible for JAB to transfer government", async () => {
      await expect(registry.transferGovernment(newAppellate, { from: JAB })).to.eventually.be.fulfilled(
        "Should have allowed JAB to transfer government",
      );
    });

    it("should not be possible for troll to transfer government", async () => {
      await expect(registry.transferGovernment(newAppellate, { from: troll })).to.eventually.be.rejectedWith(
        REVERTED,
        "Should not have allowed troll to transfer government",
      );
    });
  });
});
