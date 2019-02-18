import * as React from "react";
import { connect } from "react-redux";
import { Map } from "immutable";
import styled from "styled-components";
import { Helmet } from "react-helmet";

import { EthAddress } from "@joincivil/core";
import { colors, mediaQueries, StyledMainContainer, EthAddressViewer } from "@joincivil/components";
import { getFormattedEthAddress, getEtherscanBaseURL } from "@joincivil/utils";
import { formattedNetworkNames } from "../helpers/networkHelpers";

import { State } from "../redux/reducers";
import { ContractAddressKeys } from "../helpers/contractAddresses";

interface ContractAddressItemProps {
  address?: EthAddress;
  displayName: string;
  etherscanBaseURL?: string;
}

export interface ContractAddressesReduxProps {
  contractAddresses: Map<string, EthAddress>;
  network: string;
}

const StyledContent = styled.div`
  margin: 0 auto;
  width: 690px;

  ${mediaQueries.MOBILE} {
    padding: 0 16px;
    width: auto;
  }
`;

const StyledHeader = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  margin: 0 0 36px;
  padding: 43px 0 0;
  width: 100%;

  ${mediaQueries.MOBILE} {
    display: block;
    margin: 0 0 19px;
    padding: 16px 0 0;
  }
`;

const StyledHeaderText = styled.h2`
  font-size: 24px;
  font-weight: bold;
  letter-spacing: -0.17px;
  line-height: 30px;
  margin: 0;
`;

const StyledNetwork = styled.div`
  color: ${colors.accent.CIVIL_GRAY_1};
  font-size: 13px;
  font-weight: bold;
  letter-spacing: -0.14px;
  line-height: 21px;
  padding-top: 5px;
  text-align: right;

  ${mediaQueries.MOBILE} {
    margin: 0 0 24px;
  }
`;

const ContractAddressItem: React.SFC<ContractAddressItemProps> = props => {
  const { address, ...rest } = props;
  if (!address) {
    return null;
  }
  return <EthAddressViewer address={getFormattedEthAddress(address)} {...rest} />;
};

const ContractAddresses: React.SFC<ContractAddressesReduxProps> = props => {
  const { contractAddresses } = props;
  const addressesToDisplay: Array<[string, string]> = [
    ["CVL Token Contract Address", ContractAddressKeys.TOKEN_ADDRESS],
    ["Civil Registry Contract Address", ContractAddressKeys.TCR_ADDRESS],
    ["Partial Lock Commit Reveal (PLCR) Voting Contract Address", ContractAddressKeys.PLCR_ADDRESS],
    ["Registry Parameters Contract Address", ContractAddressKeys.PARAMETERIZER_ADDRESS],
  ];
  const etherscanBaseURL = getEtherscanBaseURL(props.network);

  return (
    <StyledMainContainer>
      <Helmet>
        <title>Contract Addresses - The Civil Registry</title>
      </Helmet>
      <StyledContent>
        <StyledHeader>
          <StyledNetwork>{formattedNetworkNames[props.network]}</StyledNetwork>
          <StyledHeaderText>Contract Addresses</StyledHeaderText>
        </StyledHeader>

        {addressesToDisplay.map((addressDisplay: [string, string]) => {
          const address: EthAddress = contractAddresses.get(addressDisplay[1]);
          return (
            <ContractAddressItem
              displayName={addressDisplay[0]}
              address={address}
              key={`${addressDisplay[0]}_${address}`}
              etherscanBaseURL={etherscanBaseURL}
            />
          );
        })}
      </StyledContent>
    </StyledMainContainer>
  );
};

const mapStateToProps = (state: State): ContractAddressesReduxProps => {
  const { contractAddresses } = state.networkDependent;
  return { network: state.network, contractAddresses };
};

export default connect(mapStateToProps)(ContractAddresses);
