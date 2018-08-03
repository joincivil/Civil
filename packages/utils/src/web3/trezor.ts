import HookedWalletSubprovider = require("web3-provider-engine/subproviders/hooked-wallet");
import * as TrezorConnect from "trezor-connect";
import * as Web3 from "web3";

// github.com/gnosis/MultiSigWallet/blob/6f1f8fc37fd53a7c87548997cc603755b5d2cca1/dapp/services/Web3Service.js#L349-L408

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

export function getTrezorWeb3Provider(networkId: number = 4, path: string = "m/44'/60'/0'/0/0" ): Web3 {

  return new HookedWalletSubprovider({
    getAccounts(cb: (err: any, res?: any) => any): void {
      TrezorConnect.ethereumGetAddress(path, (response: any) => {
        if (response.success) {
          cb(null, ["0x" + response.address]);
        } else {
          cb(response.error);
        }
      });
    },
    approveTransaction(, cb: (err: any, res?: any) => any) {
      cb(null, true);
    },
    signTransaction(txData, cb: (err: any, res?: any) => any) {

        TrezorConnect.ethereumSignTx(
          path, // address path - either array or string, see example
          toTrezorHex(txData.nonce), // nonce - hexadecimal string
          toTrezorHex(txData.gasPrice), // gas price - hexadecimal string
          toTrezorHex(txData.gas), // gas limit - hexadecimal string
          txData.to ? toTrezorHex(txData.to) : null, // address
          toTrezorHex(txData.value), // value in wei, hexadecimal string
          txData.data ? toTrezorHex(txData.data) : null, // data, hexadecimal string OR null for no data
          parseInt(networkId, 16), // chain id for EIP-155 - is only used in fw 1.4.2 and newer, older will ignore it
          function(response: any) {
            if (response.success) {
              txData.value = txData.value || "0x00";
              txData.data = ethereumjs.Util.addHexPrefix(txData.data);
              txData.gasPrice = parseInt(txData.gasPrice, 16);
              txData.nonce = parseInt(txData.nonce, 16);
              txData.gasLimit = txData.gas;
              txData.v = response.v;
              txData.s = "0x" + response.s;
              txData.r = "0x" + response.r;
              // Sign transaction
              const tx = new ethereumjs.Tx(txData);
              cb(null, "0x" + tx.serialize().toString("hex"));
            } else {
              cb(response.error);
            }
          },
        );
      });
    },
  });

}
