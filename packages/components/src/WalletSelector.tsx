import { EthAddress } from "@joincivil/typescript-types";
import * as React from "react";
import * as Web3 from "web3";
import {
  getBrowserProviderType,
  getBrowserWeb3,
  getLedgerWeb3,
  getTrezorWeb3,
  ProviderType,
} from "@joincivil/util/web3-providers";

function getAccountsPromise(web3: Web3): Promise<[any]> {
  return new Promise((fulfill, reject) => {
    web3.eth.getAccounts((err: any, res: any) => {
      if (err) {
        return reject(err);
      }
      fulfill(res);
    });
  });
}

export interface IHardwareWalletProps {
  onProviderChange(web3: Web3, providerType: ProviderType | undefined, account: EthAddress): void;
}

export interface IHardwareWalletState {
  ProviderType?: ProviderType;
  hasLoaded: boolean;
}

export class HardwareWallet extends React.Component<IHardwareWalletProps, IHardwareWalletState> {
  constructor(props: any) {
    super(props);
    this.state = {
      ProviderType: undefined,
      hasLoaded: false,
    };
  }
  public componentDidMount(): void {
    this.setState({
      ProviderType: getBrowserProviderType(),
      hasLoaded: true,
    });
  }
  public handleSelectBrowser = () => {
    const web3 = getBrowserWeb3();
    const account = web3.eth.accounts[0];
    const providerType = getBrowserProviderType();
    this.props.onProviderChange(web3, providerType, account);
  };
  public handleSelectTrezor = async () => {
    const web3 = await getTrezorWeb3();
    const accounts = await getAccountsPromise(web3);

    const account = accounts[0];
    web3.isTrezor = true;
    this.props.onProviderChange(web3, ProviderType.TREZOR, account);
  };
  public handleSelectLedger = async () => {
    const web3 = await getLedgerWeb3();
    const accounts = await getAccountsPromise(web3);

    const account = accounts[0];

    this.props.onProviderChange(web3, ProviderType.LEDGER, account);
  };
  public render(): JSX.Element {
    return (
      <div>
        <ul>
          <li>
            <button onClick={this.handleSelectBrowser}>Browser / {this.state.ProviderType || "None?"}</button>
          </li>
          <li>
            <button onClick={this.handleSelectLedger}>Ledger</button>
          </li>
          <li>
            <button onClick={this.handleSelectTrezor}>Trezor</button>
          </li>
        </ul>
        <i>ENABLE BROWSER SUPPORT ON YOUR LEDGER IF YOU KNOW WHATS GOOD FOR YOU</i>
      </div>
    );
  }
}
