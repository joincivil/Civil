import * as chai from "chai";
import { configureChai, dummyWeb3Provider } from "@joincivil/dev-utils";

import { Web3Wrapper } from "../../src/utils/web3wrapper";
import { InMemoryProvider } from "../../src/content/inmemoryprovider";

configureChai(chai);

const expect = chai.expect;

describe("content/InMemoryProvider", () => {
  const TEST_DATA = "test data, please ignore";

  let web3wrapper: Web3Wrapper;
  let instance: InMemoryProvider;

  before(() => {
    web3wrapper = new Web3Wrapper(dummyWeb3Provider());
  });

  beforeEach(() => {
    instance = new InMemoryProvider(web3wrapper);
  });

  it("has a scheme", () => {
    expect(instance.scheme()).to.not.be.empty();
  });

  it("succeeds on put", async () => {
    await expect(instance.put(TEST_DATA)).to.eventually.be.fulfilled();
  });

  it("fails on non-existent get", async () => {
    await expect(instance.get("doesn't exist")).to.eventually.be.rejected();
  });

  it("succeeds on real get", async () => {
    const uri = await instance.put(TEST_DATA);

    expect(uri).to.not.be.empty();
    await expect(instance.get(uri)).to.eventually.equal(TEST_DATA);
  });
});
