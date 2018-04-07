import "rxjs/add/operator/distinctUntilChanged";
import * as Web3 from "web3";
import * as process from "process";

import { NewsroomContract } from "../../../src/contracts/generated/newsroom";
import { TxData, TxDataAll } from "../../../src/types";
import { Web3Wrapper } from "../../../src/utils/web3wrapper";

const web3 = new Web3Wrapper(new Web3.providers.HttpProvider("http://localhost:8545"));
// tslint:disable-next-line:no-non-null-assertion
const account = web3.account!;

const data: TxData = {
  gasPrice: web3.web3.eth.gasPrice,
};

(async () => {
  console.log("Deploying contract");
  const deployTxHash = await NewsroomContract.deployTrusted.sendTransactionAsync(web3, "My Test Newsroom", data);
  const receipt = await web3.awaitReceipt(deployTxHash);
  const newsroom = NewsroomContract.atUntrusted(web3, receipt.contractAddress!);
  console.log("Contract at: ", newsroom.address);
  console.log(account);
  console.log("Am I owner: ", await newsroom.isOwner.callAsync(account));

  const subscription = newsroom
    .ContentProposedStream()
    .distinctUntilChanged((a, b) => {
      return a.blockNumber === b.blockNumber && a.logIndex === b.logIndex;
    }) // https://github.com/ethereum/web3.js/issues/573
    .subscribe(async event => {
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
  const proposeOptions = await newsroom.proposeContent.getRaw("http://someuirhere.com", data);
  console.log("Propose options:", proposeOptions);
  const proposeTxHash = await web3.sendTransaction(proposeOptions);
  await web3.awaitReceipt(proposeTxHash);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
