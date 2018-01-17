
import BigNumber from "bignumber.js";
import "rxjs/add/operator/distinctUntilChanged";
import * as Web3 from "web3";

import { artifacts } from "../../src/artifacts";
import { NewsroomContract } from "../../src/contracts/generated/newsroom";
import { TxData } from "../../src/types";
import { Web3Wrapper } from "../../src/utils/web3wrapper";

const web3 = new Web3Wrapper(new Web3.providers.HttpProvider("http://localhost:8545"));
const account = web3.account!!;

const data: TxData = {
  gasPrice: web3.web3.eth.gasPrice,
};

(async () => {
  console.log("Deploying contract");
  const newsroom = await NewsroomContract.deployTrusted.sendTransactionAsync(web3.web3, data);
  console.log("Contract at: ", newsroom.address);
  console.log("Am I superadmin: ", await newsroom.isSuperuser.callAsync(account));

  const subscription = newsroom
      .ContentProposedStream()
      .distinctUntilChanged((a, b) => {
        return a.blockNumber === b.blockNumber && a.logIndex === b.logIndex;
      }) // https://github.com/ethereum/web3.js/issues/573
      .subscribe(async (event) => {
        console.log("Content proposed");
        console.log("\tAuthor: ", event.args.author);
        console.log("\tContent id:", event.args.id.toString());
        console.log(
          "\tTimestamp for article id " + event.args.id.toString() + ": ",
          (await newsroom.timestamp.callAsync(event.args.id)).toString(),
        );
        console.log("\tGot an article, unsubscribing");
        subscription.unsubscribe();
      });

  console.log("Proposing content");
  const tx = await newsroom.proposeContent.sendTransactionAsync("http://someurihere.com", data);
})();
