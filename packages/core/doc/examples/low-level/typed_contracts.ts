import { currentAccount, EthApi } from "@joincivil/ethapi";
import { TxData } from "@joincivil/typescript-types";
import * as process from "process";
import "rxjs/add/operator/distinctUntilChanged";
import * as Web3 from "web3";
import { Artifact, artifacts } from "../../../src/contracts/generated/artifacts";
import { NewsroomContract } from "../../../src/contracts/generated/wrappers/newsroom";

const web3 = new EthApi(
  new Web3.providers.HttpProvider("http://localhost:8545"),
  Object.values<Artifact>(artifacts).map(a => a.abi),
);

(async () => {
  const account = (await currentAccount(web3))!;

  const data: TxData = {
    gasPrice: await web3.getGasPrice(),
  };
  // tslint:disable-next-line:no-non-null-assertion
  console.log("Deploying contract");
  const deployTxHash = await NewsroomContract.deployTrusted.sendTransactionAsync(
    web3,
    "My Test Newsroom",
    "",
    "",
    data,
  );

  const receipt = await web3.awaitReceipt(deployTxHash);
  const newsroom = NewsroomContract.atUntrusted(web3, receipt.contractAddress!);
  console.log("Contract at: ", newsroom.address);
  console.log(account);
  console.log("Name: ", await newsroom.name.callAsync());
  console.log("Am I owner: ", await newsroom.isOwner.callAsync(account));

  const subscription = newsroom.RevisionUpdatedStream().subscribe(async event => {
    console.log("Content proposed");
    console.log("\tContent id:", event.args.contentId.toString());
    console.log("\tGot an article, unsubscribing");
    subscription.unsubscribe();
  });

  console.log("Publishing a revision");
  const proposeOptions = await newsroom.publishContent.getRaw("http://someuirhere.com", "hash", "", "", data);
  const proposeTxHash = await web3.sendTransaction(proposeOptions);
  await web3.awaitReceipt(proposeTxHash);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
