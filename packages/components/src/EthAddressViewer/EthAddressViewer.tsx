import * as React from "react";

import { colors } from "../styleConstants";
import { Button, InvertedButton, buttonSizes } from "../Button";
import { NorthEastArrow } from "../icons";

import {
  StyledEthAddressViewer,
  StyledDisplayName,
  StyledEthAddressContainer,
  StyledEthAddress,
} from "./StyledEthAddressViewer";

export interface EthAddressViewerProps {
  address: string;
  displayName: string;
  etherscanBaseURL?: string;
}

export const EthAddressViewer: React.FunctionComponent<EthAddressViewerProps> = props => {
  const { address, displayName, etherscanBaseURL } = props;

  const copyToClipBoard = () => {
    const textArea = document.createElement("textarea");
    textArea.innerText = props.address.replace(/ /g, "")!;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
  };

  const etherscanURL = etherscanBaseURL && `${etherscanBaseURL}/address/${address.replace(/ /g, "")}`;

  return (
    <StyledEthAddressViewer>
      <StyledDisplayName>{displayName}</StyledDisplayName>
      <StyledEthAddressContainer>
        <StyledEthAddress>{props.address}</StyledEthAddress>
        <Button
          size={buttonSizes.SMALL}
          onClick={() => {
            copyToClipBoard();
          }}
        >
          Copy
        </Button>
        {!!etherscanURL && (
          <InvertedButton size={buttonSizes.SMALL} href={etherscanURL} target="_blank">
            Etherscan <NorthEastArrow color={colors.accent.CIVIL_BLUE} />
          </InvertedButton>
        )}
      </StyledEthAddressContainer>
    </StyledEthAddressViewer>
  );
};
