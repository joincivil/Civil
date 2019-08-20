import { currentAccount, EthApi } from "@joincivil/ethapi";
import * as process from "process";
import "rxjs/add/operator/distinctUntilChanged";
import { Artifact, artifacts } from "../../../src/contracts/generated/artifacts";
import { NewsroomContract } from "../../../src/contracts/generated/wrappers/newsroom";
import Web3 = require("web3");

const web3 = new EthApi(
  new Web3.providers.HttpProvider("http://localhost:8545"),
  Object.values<Artifact>(artifacts).map(a => a.abi),
);

(async () => {
  const account = (await currentAccount(web3))!;

  const gas = await web3.getGasPriceString();
  const data = {
    from: account,
    gasPrice: gas,
  };
  // tslint:disable-next-line:no-non-null-assertion
  console.log("Deploying contract");
  const deployTxHash = await NewsroomContract.deployTrusted.sendTransactionAsync(
    web3,
    "My Test Newsroom",
    "http://foo.bar",
    Web3.utils.sha3("test"),
    data,
  );

  console.log("deployed contract", deployTxHash);

  // const receipt = await web3.awaitReceipt(deployTxHash);
  // console.log("got receipt", receipt);
  // const newsroom = NewsroomContract.atUntrusted(web3, receipt.contractAddress!);
  // console.log("Contract at: ", newsroom.address);
  // console.log(account);
  // console.log("Name: ", await newsroom.name.callAsync());
  // console.log("Am I owner: ", await newsroom.isOwner.callAsync(account));

  // const subscription = newsroom.RevisionUpdatedStream().subscribe(async event => {
  //   console.log("Content proposed");
  //   console.log("\tContent id:", event.returnValues.contentId.toString());
  //   console.log("\tGot an article, unsubscribing");
  //   subscription.unsubscribe();
  // });

  // for (let i = 0; i < 3; i++) {
  //   console.log("Publishing content");
  //   const proposeOptions = await newsroom.publishContent.getRaw("http://someuirhere.com", "hash", "0x", "0x", data);
  //   const proposeTxHash = await web3.sendTransaction(proposeOptions);
  //   await web3.awaitReceipt(proposeTxHash);
  // }

  // console.log("Historic events about published articles");
  // newsroom.ContentPublishedStream(undefined, { fromBlock: 0, toBlock: "latest" }).subscribe(event => {
  //   console.log("\tContent id:", event.returnValues.contentId.toString());
  // });

  // newsroom
  //   .ContentPublishedStream(undefined, { fromBlock: 0, toBlock: "latest" })
  //   .last()
  //   .subscribe(event => {
  //     console.log("Only last publish");
  //     console.log("\tContent id:", event.returnValues.contentId.toString());
  //   });
})().catch(err => {
  console.error(err);
  process.exit(1);
});
