import { EthAddress } from "@joincivil/typescript-types";
import * as React from "react";
import * as Web3 from "web3";
import {
  getBrowserProviderType,
  getBrowserWeb3,
  getLedgerWeb3,
  getHasLedger,
  getHardwareWeb3,
  getTrezorWeb3,
  ProviderType,
  getAccountsPromise,
} from "@joincivil/utils";

export interface IWalletSelectorProps {
  network: string;
  onProviderChange?(web3: Web3, providerType: ProviderType | undefined, account?: EthAddress): void;
}

export interface IWalletSelectorState {
  browserPoviderType?: ProviderType;
  hasLoaded: boolean;
  isHTTPS: boolean;
  hasLedger: boolean;
  hasTrezor: boolean;
}

function getIsHTTPS(): boolean {
  const globalWindow = window as any;

  return globalWindow && globalWindow.location.protocol === "https:";
}

export class WalletSelector extends React.Component<IWalletSelectorProps, IWalletSelectorState> {
  constructor(props: any) {
    super(props);
    this.state = {
      browserPoviderType: undefined,
      hasLoaded: false,
      isHTTPS: false,
      hasLedger: false,
      hasTrezor: true,
    };
  }
  public async componentDidMount(): Promise<void> {
    this.setState({
      browserPoviderType: getBrowserProviderType(),
      hasLoaded: true,
      isHTTPS: getIsHTTPS(),
      hasLedger: await getHasLedger(),
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
  public handleSelectTrezor = async () => {
    const { onProviderChange, network } = this.props;
    const web3 = await getTrezorWeb3(network);

    console.log({ web3 });

    const accounts = await getAccountsPromise(web3);
    console.log({ accounts });
    const account = accounts[0];

    if (onProviderChange) {
      onProviderChange(web3, ProviderType.TREZOR, account);
    }
  };
  public handleSelectLedger = async () => {
    const { onProviderChange, network } = this.props;
    const web3 = await getLedgerWeb3(network);
    const accounts = await getAccountsPromise(web3);

    const account = accounts[0];
    if (onProviderChange) {
      onProviderChange(web3, ProviderType.LEDGER, account);
    }
  };

  public handleSelectReadOnly = async () => {
    const { onProviderChange } = this.props;
    if (onProviderChange) {
      onProviderChange(getHardwareWeb3(), ProviderType.LEDGER);
    }
  };

  public renderBrowserSelector(): JSX.Element {
    const { browserPoviderType } = this.state;

    if (!browserPoviderType) {
      return <li>Maybe you should get metamask?</li>;
    }

    return (
      <li>
        {browserPoviderType && <button onClick={this.handleSelectBrowser}>Browser / {browserPoviderType}</button>}
      </li>
    );
  }

  public renderLedgerSelector(): JSX.Element {
    const { hasLedger, isHTTPS } = this.state;

    if (!hasLedger) {
      return <li>Maybe you should get a ledger?</li>;
    }

    return (
      <>
        <li>
          <button onClick={this.handleSelectLedger}>Ledger</button>
        </li>
        <i>ENABLE BROWSER SUPPORT ON YOUR LEDGER IF YOU KNOW WHATS GOOD FOR YOU</i>
        {!isHTTPS && <div>For Ledger support, you need https</div>}
      </>
    );
  }

  public renderTrezorSelector(): JSX.Element {
    const { hasTrezor } = this.state;

    if (!hasTrezor) {
      return <li>Maybe you should get a Trezor?</li>;
    }

    return (
      <>
        <li>
          <button onClick={this.handleSelectTrezor}>Trezor</button>
        </li>
      </>
    );
  }

  public renderReadOnly(): JSX.Element {
    return (
      <>
        <li>
          <button onClick={this.handleSelectReadOnly}>Continue with read only.</button>
        </li>
      </>
    );
  }

  public render(): JSX.Element {
    const { isHTTPS } = this.state;

    return (
      <div>
        <ul>
          {this.renderBrowserSelector()}
          {this.renderLedgerSelector()}
          {this.renderTrezorSelector()}
          {this.renderReadOnly()}
        </ul>
      </div>
    );
  }
}
