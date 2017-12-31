
import * as bn from "bignumber.js";
import "rxjs/add/operator/distinctUntilChanged";
import * as Web3 from "web3";

import { artifacts } from "../../src/artifacts";
import { NewsroomContract } from "../../src/contracts/generated/newsroom";
import { TxData } from "../../src/types";
import { Web3Wrapper } from "../../src/utils/web3wrapper";

const web3 = new Web3Wrapper(new Web3.providers.HttpProvider("http://localhost:8545"));

const data: TxData = {
  gasPrice: new bn(20000000000),
  gas: new bn(8002793),
};

(async () => {
  console.log("Deploying contract");
  const newsroom = await NewsroomContract.deployTrusted(web3.web3, data);
  console.log("Contract at: ", newsroom.address);
  console.log("Owner: ", await newsroom.owner.callAsync());

  newsroom
      .ContentProposedStream()
      .distinctUntilChanged((a, b) => {
        return a.blockNumber === b.blockNumber && a.logIndex === b.logIndex;
      }) // https://github.com/ethereum/web3.js/issues/573
      .subscribe((event) => {
    console.log("Content proposed");
    console.log("\tAuthor: ", event.args.author);
    console.log("\tContent id:", event.args.id.toString());
    (async () => {
      console.log(
        "Timestamp for article id " + event.args.id.toString() + ": ",
        (await newsroom.timestamp.callAsync(event.args.id)).toString(),
      );
    })();
  });

  console.log("Proposing content");
  await newsroom.proposeContent.sendTransactionAsync("http://someurihere.com", data);
})();
