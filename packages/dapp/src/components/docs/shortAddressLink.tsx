import * as React from "react";
// import { config } from 'config'

export interface ShortAddressLinkProps {
  address: string;
}

export default class ShortAddressLink extends React.Component<ShortAddressLinkProps> {
  public render(): JSX.Element {
    // const { interaction } = config
    // if (!interaction) { return null }
    const { address } = this.props;
    const urlPrefix = ""; // interaction.network === '2' ? 'testnet.' : ''
    const url = `https://${urlPrefix}etherscan.io/address/${address}`;
    return (
      <a target="_blank" href={url}>
        {address}
      </a>
    );
  }
}
