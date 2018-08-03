import { EthAddress } from "@joincivil/typescript-types";
import * as React from "react";
import * as Web3 from "web3";
import {
  getBrowserProviderType,
  getBrowserWeb3,
  getLedgerWeb3,
  hasLedger,
  // getTrezorWeb3,  // TODO(jorgelo): Add this back.
  ProviderType,
  getAccountsPromise,
} from "@joincivil/utils";

export interface IWalletSelectorProps {
  network: number;
  onProviderChange?(web3: Web3, providerType: ProviderType | undefined, account: EthAddress): void;
}

export interface IWalletSelectorState {
  providerType?: ProviderType;
  hasLoaded: boolean;
  isHTTPS: boolean;
  hasLedger: boolean;
}

function getIsHTTPS(): boolean {
  const globalWindow = window as any;

  return globalWindow && globalWindow.location.protocol === "https:";
}

export class WalletSelector extends React.Component<IWalletSelectorProps, IWalletSelectorState> {
  constructor(props: any) {
    super(props);
    this.state = {
      providerType: undefined,
      hasLoaded: false,
      isHTTPS: false,
      hasLedger: false,
    };
  }
  public async componentDidMount(): Promise<void> {
    this.setState({
      providerType: getBrowserProviderType(),
      hasLoaded: true,
      isHTTPS: getIsHTTPS(),
      hasLedger: await hasLedger(),
    });
  }
  public handleSelectBrowser = () => {
    const { onProviderChange } = this.props;
    const web3 = getBrowserWeb3();
    const account = web3.eth.accounts[0];
    const providerType = getBrowserProviderType();

    // TODO(jorgelo): DRY this up.
    if (onProviderChange) {
      onProviderChange(web3, providerType, account);
    }
  };
  // public handleSelectTrezor = async () => {
  //   const { onProviderChange } = this.props;
  //   const web3 = await getTrezorWeb3();
  //   const accounts = await getAccountsPromise(web3);

  //   const account = accounts[0];

  //   if (onProviderChange) {
  //     onProviderChange(web3, ProviderType.TREZOR, account);
  //   }
  // };
  public handleSelectLedger = async () => {
    const { onProviderChange } = this.props;
    const web3 = await getLedgerWeb3();
    const accounts = await getAccountsPromise(web3);

    const account = accounts[0];
    if (onProviderChange) {
      onProviderChange(web3, ProviderType.LEDGER, account);
    }
  };
  public render(): JSX.Element {
    const { isHTTPS, providerType } = this.state;

    return (
      <div>
        <ul>
          <li>{providerType && <button onClick={this.handleSelectBrowser}>Browser / {providerType}</button>}</li>
          <li>
            <button onClick={this.handleSelectLedger}>Ledger</button>
          </li>
          {/* <li>
            <button onClick={this.handleSelectTrezor}>Trezor</button>
          </li> */}
        </ul>
        <i>ENABLE BROWSER SUPPORT ON YOUR LEDGER IF YOU KNOW WHATS GOOD FOR YOU</i>
        {!isHTTPS && <div>For Ledger support, you need https</div>}
      </div>
    );
  }
}
