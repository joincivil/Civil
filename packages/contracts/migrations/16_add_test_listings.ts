import { BN } from "bn.js";

module.exports = (deployer: any, network: string, accounts: string[]) => {
  const Newsroom = artifacts.require("Newsroom");
  const CivilTCR = artifacts.require("CivilTCR");
  const Token = artifacts.require("CVLToken");

  deployer.then(async () => {
    if (network === "ganache") {
      const civilTCR = await CivilTCR.deployed();
      const token = await Token.deployed();

      await token.approve(civilTCR.address, new BN("1000000000000000000000"), { from: accounts[5] });
      await token.approve(civilTCR.address, new BN("1000000000000000000000"), { from: accounts[6] });

      const newsroom1 = await Newsroom.new("Fake News 1000", "http://fakecharter.uri", web3.utils.sha3("test"), {
        from: accounts[5],
      });
      await civilTCR.apply(newsroom1.address, new BN("100000000000000000000"), "", { from: accounts[5] });

      const newsroom2 = await Newsroom.new("The Ultra News 2000", "https://fakecharter.com", web3.utils.sha3("test"), {
        from: accounts[5],
      });
      await civilTCR.apply(newsroom2.address, new BN("100000000000000000000"), "", { from: accounts[5] });
      await civilTCR.challenge(newsroom2.address, "", { from: accounts[5] });
    }
  });
};
