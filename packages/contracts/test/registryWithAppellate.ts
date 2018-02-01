import * as chai from "chai";
import { REVERTED } from "../utils/constants";
import ChaiConfig from "./utils/chaiconfig";
import { is0x0Address } from "./utils/contractutils";

const RegistryWithAppellate = artifacts.require("RegistryWithAppellate");

ChaiConfig();
const expect = chai.expect;

// TODO: Revisit and add many more tests after RegistryWtihAppellate extends real TCR
contract("RegistryWithAppellate", (accounts: string[]) => {
  const EXISTING_LISTING_ADDRESS = accounts[2];
  const NO_LISTING_ADDRESS = accounts[3];

  let registry: any;

  beforeEach(async () => {
    registry = await RegistryWithAppellate.new();
    await registry.submitAppeal(EXISTING_LISTING_ADDRESS, { from: accounts[1] });
  });

  describe("owner", () => {
    it("returns 0x0 on non-existent listing", async () => {
      const is0x0 = is0x0Address(await registry.listingOwner(NO_LISTING_ADDRESS));
      expect(is0x0).to.be.true();
    });

    it("returns correct owner for existing listing", async () => {
      expect(await registry.listingOwner(EXISTING_LISTING_ADDRESS)).to.be.equal(accounts[1]);
    });

    it("returns 0x0 on denied listing", async () => {
      await expect(registry.denyAppeal(EXISTING_LISTING_ADDRESS)).to.eventually.be.fulfilled();
      const is0x0 = is0x0Address(await registry.listingOwner(EXISTING_LISTING_ADDRESS));
      expect(is0x0).to.be.true();
    });
  });

  describe("is in progress", () => {
    it("returns false for non-existent listing", async () => {
      await expect(registry.isAppealInProgress(NO_LISTING_ADDRESS)).to.eventually.be.false();
    });
    it("returns true for existent listing", async () => {
      await expect(registry.isAppealInProgress(EXISTING_LISTING_ADDRESS)).to.eventually.be.true();
    });
    it("returns false for denied listing", async () => {
      await expect(registry.denyAppeal(EXISTING_LISTING_ADDRESS));
      await expect(registry.isAppealInProgress(EXISTING_LISTING_ADDRESS)).to.eventually.be.false();
    });
    it("returns false for approved listing", async () => {
      await expect(registry.grantAppeal(EXISTING_LISTING_ADDRESS));
      await expect(registry.isAppealInProgress(EXISTING_LISTING_ADDRESS)).to.eventually.be.false();
    });
  });

  describe("appeal", () => {
    it("cannot be granted by non-owner of registry", async () => {
      await expect(registry.grantAppeal(EXISTING_LISTING_ADDRESS, { from : accounts[1] }))
      .to.eventually.be.rejectedWith(REVERTED);
    });

    it("cannot be denied by non-owner of registry", async () => {
      await expect(registry.denyAppeal(EXISTING_LISTING_ADDRESS, { from : accounts[1] }))
      .to.eventually.be.rejectedWith(REVERTED);
    });

    it("fails on granting appeal of non-existent listing", async () => {
      await expect(registry.grantAppeal(NO_LISTING_ADDRESS)).to.eventually.be.rejectedWith(REVERTED);
    });

    it("fails on denying appeal of non-existent listing", async () => {
      await expect(registry.denyAppeal(NO_LISTING_ADDRESS)).to.eventually.be.rejectedWith(REVERTED);
    });
  });

  describe("submit appeal", () => {
    it("fails on listing already present", async () => {
      await expect(registry.submitAppeal(EXISTING_LISTING_ADDRESS, { from: accounts[1] }))
      .to.eventually.be.rejectedWith(REVERTED);
    });

    it("succeeds on listing not already present", async () => {
      await expect(registry.submitAppeal(NO_LISTING_ADDRESS, { from: accounts[1] })).to.eventually.be.fulfilled();
    });
  });

  describe("grant appeal", () => {
    it("listing is not whitelisted before appeal granted", async () => {
      expect(await registry.isWhitelisted(EXISTING_LISTING_ADDRESS)).to.be.false();
    });

    it("succeeds on existent non-whitelisted listing", async () => {
      await expect(registry.grantAppeal(EXISTING_LISTING_ADDRESS)).to.eventually.be.fulfilled();
    });

    it("listing is whitelisted after appeal granted", async () => {
      await expect(registry.grantAppeal(EXISTING_LISTING_ADDRESS));
      expect(await registry.isWhitelisted(EXISTING_LISTING_ADDRESS)).to.be.true();
    });

    it("fails on already whitelisted listing", async () => {
      await registry.grantAppeal(EXISTING_LISTING_ADDRESS);
      await expect(registry.grantAppeal(EXISTING_LISTING_ADDRESS)).to.eventually.be.rejectedWith(REVERTED);
    });
  });

  describe("deny appeal", () => {
    it("succeeds on existent non-whitelisted listing", async () => {
      await expect(registry.denyAppeal(EXISTING_LISTING_ADDRESS)).to.eventually.be.fulfilled();
    });

    it("is not whitelisted after appeal denied", async () => {
      expect(await registry.isWhitelisted(EXISTING_LISTING_ADDRESS)).to.be.false();
    });

    it("fails on already whitelisted listing", async () => {
      await registry.grantAppeal(EXISTING_LISTING_ADDRESS);
      await expect(registry.denyAppeal(EXISTING_LISTING_ADDRESS)).to.eventually.be.rejectedWith(REVERTED);
    });

    it("fails on already denied listing", async () => {
      await registry.denyAppeal(EXISTING_LISTING_ADDRESS);
      await expect(registry.denyAppeal(EXISTING_LISTING_ADDRESS)).to.eventually.be.rejectedWith(REVERTED);
    });
  });
});
