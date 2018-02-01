import * as chai from "chai";
import ChaiConfig from "../utils/chaiconfig";
import * as utils from "../utils/contractutils";

ChaiConfig();
const expect = chai.expect;

contract("Registry", (accounts) => {
  describe("Function: appWasMade", () => {
    const [applicant] = accounts;

    const minDeposit = utils.paramConfig.minDeposit;
    const listing2 = "0x0000000000000000000000000000000000000002";
    const listing3 = "0x0000000000000000000000000000000000000003";
    let registry: any;

    beforeEach(async () => {
      registry = await utils.createAllTestAddressRegistryInstance(accounts);
    });

    it("should return true if applicationExpiry was previously initialized", async () => {
      // Apply
      await registry.apply(listing2, minDeposit, "", { from: applicant });
      const result = await registry.appWasMade(listing2);
      expect(result).to.be.true("should have returned true for the applied listing");

      // Commit stage complete
      await utils.advanceEvmTime(utils.paramConfig.commitStageLength + 1);
      const resultTwo = await registry.appWasMade(listing2);
      expect(resultTwo).to.be.true("should have returned true because app is still not expired");

      // Reveal stage complete, update status (whitelist it)
      await utils.advanceEvmTime(utils.paramConfig.revealStageLength + 1);
      await registry.updateStatus(listing2, { from: applicant });
      const isWhitelisted = await registry.isWhitelisted(listing2);
      expect(isWhitelisted).to.be.true("should have been whitelisted");
      const resultThree = await registry.appWasMade(listing2);
      expect(resultThree).to.be.true("should have returned true because its whitelisted");

      // Exit
      await registry.exitListing(listing2, { from: applicant });
      const resultFour = await registry.appWasMade(listing2);
      expect(resultFour).to.be.false("should have returned false because exit");
    });

    it("should return false if applicationExpiry was uninitialized", async () => {
      const result = await registry.appWasMade(listing3);
      expect(result).to.be.false("should have returned false because listing was never applied");
    });
  });
});
