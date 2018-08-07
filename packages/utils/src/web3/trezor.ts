// @ts-ignore
import HookedWalletSubprovider = require("web3-provider-engine/subproviders/hooked-wallet");
// @ts-ignore
import TrezorConnect from "trezor-connect";
import * as Web3 from "web3";
import { addHexPrefix } from "ethereumjs-util";
import EthereumTx = require("ethereumjs-tx");
import { getHardwareWeb3 } from "./index";

function toTrezorHex(hex: string): string | undefined {
  let trezorHex;
  if (hex === undefined || hex === null) {
    return;
  }
  if (hex.length > 2 && hex.slice(0, 2) === "0x") {
    trezorHex = hex.slice(2);
  } else {
    trezorHex = hex;
  }

  if (trezorHex.length % 2 === 0) {
    return trezorHex;
  } else {
    return "0" + trezorHex;
  }
}
// Inspired by github.com/gnosis/MultiSigWallet/blob/6f1f8fc37fd53a7c87548997cc603755b5d2cca1/dapp/services/Web3Service.js#L349-L408

export function getTrezorWeb3(network: string, path: string = "m/44'/60'/0'/0/0"): Web3 {
  const trezorProvider = new HookedWalletSubprovider({
    getAccounts(cb: (err: any, res?: any) => any): void {
      TrezorConnect.ethereumGetAddress(path, (response: any) => {
        if (response.success) {
          cb(null, ["0x" + response.address]);
        } else {
          cb(response.error);
        }
      });
    },
    approveTransaction(_: any, cb: (err: any, res?: any) => any): void {
      cb(null, true);
    },
    signMessage(data: string, account: any, cb: (err: any, res?: any) => any) {
      TrezorConnect.ethereumSignMessage(path, data, (result: any) => {
        const { payload, success } = result;

        if (!success) {
          cb(payload.error);
          return;
        }
        cb(undefined, payload.signature);
      });
    },
    async signTransaction(txData: any, cb: (err: any, res?: any) => any): Promise<void> {
      const transaction = {
        to: toTrezorHex(txData.to),
        value: toTrezorHex(txData.value),
        data: toTrezorHex(txData.data),
        chainId: parseInt(network, 16),
        gasLimit: toTrezorHex(txData.gas),
        gasPrice: toTrezorHex(txData.gasPrice),
      };

      try {
        const { v, s, r } = await TrezorConnect.ethereumSignTransaction({
          path,
          transaction,
        });

        const res = {
          value: txData.value || "0x00",
          data: addHexPrefix(txData.data),
          gasPrice: parseInt(txData.gasPrice, 16),
          nonce: parseInt(txData.nonce, 16),
          gasLimit: txData.gas,
          v,
          s: "0x" + s,
          r: "0x" + r,
        };

        const tx = new EthereumTx(res);
        cb(null, "0x" + tx.serialize().toString("hex"));
      } catch (err) {
        cb(err);
        return;
      }
    },
  });

  return getHardwareWeb3(trezorProvider);
}
