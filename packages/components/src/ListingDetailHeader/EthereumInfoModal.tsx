import * as React from "react";
import { EthAddress } from "@joincivil/core";

import { EthAddressViewer } from "../EthAddressViewer";
import { Modal } from "../Modal";
import { CloseXIcon } from "../icons";
import { colors } from "../styleConstants";

import {
  StyledEthereumInfoModalInner,
  StyledEthereumAddressDescription,
  StyledModalHeader,
  StyledCloseModal,
} from "./ListingDetailHeaderStyledComponents";

export interface EthereumInfoModalProps {
  listingAddress: EthAddress;
  owner: EthAddress;
  etherscanBaseURL: string;
  ethInfoModalLearnMoreURL: string;
  handleCloseClick(): void;
}

const EthereumInfoModal: React.FunctionComponent<EthereumInfoModalProps> = props => {
  return (
    <Modal width={630}>
      <StyledModalHeader>
        <div>Ethereum Info</div>
        <StyledCloseModal onClick={props.handleCloseClick}>
          <CloseXIcon color={colors.accent.CIVIL_GRAY_3} />
        </StyledCloseModal>
      </StyledModalHeader>
      <StyledEthereumInfoModalInner>
        <EthAddressViewer
          address={props.owner}
          displayName="Public Wallet Address"
          etherscanBaseURL={props.etherscanBaseURL}
        />
        <StyledEthereumAddressDescription>
          <p>This public wallet address is the Newsroom's identity on the blockchain.</p>
          <p>You can send CVL and ETH to this wallet address.</p>
        </StyledEthereumAddressDescription>
      </StyledEthereumInfoModalInner>

      <StyledEthereumInfoModalInner>
        <EthAddressViewer
          address={props.listingAddress}
          displayName="Smart Contract Address"
          etherscanBaseURL={props.etherscanBaseURL}
        />
        <StyledEthereumAddressDescription>
          <p>Smart contract address allow you to see the Newsroom's activities on the blockchain.</p>
          <p>
            <b>Do not send CVL or ETH to this contract address.</b> You will lose your cryptocurrency, and the Civil
            Media Company can not help you to retrieve it.{" "}
            <a href={props.ethInfoModalLearnMoreURL} target="_blank">
              Learn more
            </a>.
          </p>
        </StyledEthereumAddressDescription>
      </StyledEthereumInfoModalInner>
    </Modal>
  );
};

export default EthereumInfoModal;
