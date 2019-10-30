import * as React from "react";
import { copyToClipboard } from "@joincivil/utils";

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
  displayName: string | JSX.Element;
  etherscanBaseURL?: string;
}

export const EthAddressViewer: React.FunctionComponent<EthAddressViewerProps> = props => {
  const { address, displayName, etherscanBaseURL } = props;

  const etherscanURL = etherscanBaseURL && `${etherscanBaseURL}/address/${address.replace(/ /g, "")}`;

  return (
    <StyledEthAddressViewer>
      <StyledDisplayName>{displayName}</StyledDisplayName>
      <StyledEthAddressContainer>
        <StyledEthAddress>{props.address}</StyledEthAddress>
        <Button size={buttonSizes.SMALL} onClick={() => copyToClipboard(address.replace(/ /g, ""))}>
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
