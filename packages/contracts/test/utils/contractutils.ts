import * as Web3 from "web3";

export function findEvent(tx: any, eventName: string) {
  return tx.logs.find((log: any) => log.event === eventName);
}

export function idFromEvent(tx: any) {
  for (const log of tx.logs) {
    if (log.args.id) {
      return log.args.id;
    }
  }
  return undefined;
}

export function is0x0Address(address: string) {
  return address === "0x0" || address === "0x0000000000000000000000000000000000000000";
}

export function timestampFromTx(web3: Web3, tx: Web3.Transaction | Web3.TransactionReceipt) {
  return new Promise((resolve, reject) => {
    if (tx.blockNumber == null) {
      return reject(new Error("Transaction not yet mined"));
    }
    web3.eth.getBlock(tx.blockNumber, (err, block) => {
      if (err) {
        return reject(err);
      }
      resolve(block.timestamp);
    });
  });
}
