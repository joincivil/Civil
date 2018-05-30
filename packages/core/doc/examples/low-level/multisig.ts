import "rxjs/add/operator/distinctUntilChanged";
import * as Web3 from "web3";
import * as process from "process";
import BigNumber from "bignumber.js";

import { EthApi } from "../../../src/utils/ethapi";
import { MultiSigWalletContract } from "../../../src/contracts/generated/wrappers/multi_sig_wallet";
import { Multisig } from "../../../src/contracts/multisig/multisig";

const web3 = new EthApi(new Web3.providers.HttpProvider("http://localhost:8545"));
// tslint:disable-next-line:no-non-null-assertion
const account = web3.account!;

(async () => {
  console.log("Deploying multisig");
  console.log("account: ", account);
  const deployTxHash = await MultiSigWalletContract.deployTrusted.sendTransactionAsync(
    web3,
    [account],
    new BigNumber(1),
  );
  const deployReceipt = await web3.awaitReceipt(deployTxHash);
  const multisig = Multisig.atUntrusted(web3, deployReceipt.contractAddress!);

  console.log("Sending some money");
  await (await multisig.transferEther(new BigNumber(1))).awaitReceipt();

  console.log("Sending money back");
  console.log("\tSubmitting and executing transaction");
  await (await multisig.submitTransaction(account, new BigNumber(72), "")).awaitReceipt();

  console.log("Adding owner");
  await (await multisig.addOwner("0x12345678901234567890123456789012345678901234567890")).awaitReceipt();
  console.log("Upping required");
  await (await multisig.changeRequirement(2)).awaitReceipt();

  console.log("Owners", await multisig.owners());
  console.log("Required", await multisig.required());

  console.log("Sending more money back");
  let transaction = await (await multisig.submitTransaction(account, new BigNumber(42), "")).awaitReceipt();
  console.log("\tTransaction nonce", transaction.id);
  console.log("\tConfirmations:", await transaction.confirmations());
  console.log("\tCan execute transfer:", await transaction.canBeExecuted());
  console.log("\tExecuting transaction");
  transaction = await (await transaction.execute()).awaitReceipt();

  console.log("\tTransaction shouldn't be executed:", transaction.information.executed);
  if (transaction.information.executed) {
    throw new Error("Ouch, transaction was executed after all");
  }
})().catch(err => {
  console.error(err);
  process.exit(1);
});
