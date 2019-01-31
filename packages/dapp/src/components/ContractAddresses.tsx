import * as React from "react";
import { connect } from "react-redux";
import { Map } from "immutable";

import { EthAddress } from "@joincivil/core";
import { Button, InvertedButton, buttonSizes } from "@joincivil/components";

import { State } from "../redux/reducers";
import { ContractAddressKeys } from "../helpers/contractAddresses";

interface ContractAddressItemProps {
  address?: EthAddress;
  displayName: string;
}

export interface ContractAddressesReduxProps {
  contractAddresses: Map<string, EthAddress>;
}

const ContractAddressItem: React.SFC<ContractAddressItemProps> = props => {
  const { address } = props;
  if (!address) {
    return null;
  }

  const copyToClipBoard = () => {
    const textArea = document.createElement("textarea");
    textArea.innerText = props.address!;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
  };

  return (
    <>
      <div>{props.displayName}</div>
      <div>
        <div>{props.address}</div>
        <Button
          size={buttonSizes.SMALL}
          onClick={() => {
            copyToClipBoard();
          }}
        >
          Copy
        </Button>
        <InvertedButton size={buttonSizes.SMALL}>Etherscan</InvertedButton>
      </div>
    </>
  );
};

const ContractAddresses: React.SFC<ContractAddressesReduxProps> = props => {
  const { contractAddresses } = props;
  const addressesToDisplay: Array<[string, string]> = [
    ["CVL Token Contract Address", ContractAddressKeys.TOKEN_ADDRESS],
    ["Civil Registry Contract Address", ContractAddressKeys.TCR_ADDRESS],
    ["Partial Lock Commit Reveal (PLCR) Voting Contract Address", ContractAddressKeys.PLCR_ADDRESS],
    ["Registry Parameters Contract Address", ContractAddressKeys.PARAMETERIZER_ADDRESS],
  ];

  return (
    <>
      <div>Contract Addresses</div>

      {addressesToDisplay.map((addressDisplay: [string, string]) => {
        const address: EthAddress = contractAddresses.get(addressDisplay[1]);
        return (
          <ContractAddressItem
            displayName={addressDisplay[0]}
            address={address}
            key={`${addressDisplay[0]}_${address}`}
          />
        );
      })}
    </>
  );
};

const mapStateToProps = (state: State): ContractAddressesReduxProps => {
  const { contractAddresses } = state.networkDependent;
  return { contractAddresses };
};

export default connect(mapStateToProps)(ContractAddresses);
