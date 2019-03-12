import * as React from "react";
import { OBSectionHeader, OBSectionDescription, colors, fonts } from "@joincivil/components";
import { EthAddress } from "@joincivil/core";
import styled from "styled-components";

export interface LetsGetStartedPageProps {
  name: string;
  walletAddress?: EthAddress;
}

const BorderBox = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_3};
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.09);
  border-radius: 8px;
  padding: 24px;
  & > div:first-child {
    margin-bottom: 25px;
  }
`;

const Label = styled.div`
  font-family: ${fonts.SANS_SERIF};
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  color: ${colors.primary.CIVIL_GRAY_2};
`;

const Value = styled.div`
  font-family: ${fonts.SANS_SERIF};
  font-size: 16px;
  line-height: 24px;
`;

const Smalltext = styled.div`
  color: ${colors.accent.CIVIL_GRAY_2};
  font-family: ${fonts.SANS_SERIF};
  font-size: 13px;
  font-weight: 500;
  line-height: 21px;
`;

const WalletAddress = styled.div`
  border: 1px solid ${colors.accent.CIVIL_GRAY_4};
  background-color: ${colors.accent.CIVIL_GRAY_6};
  box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  font-family: ${fonts.MONOSPACE};
  color: ${colors.primary.CIVIL_GRAY_1};
  letter-spacing: -0.15px;
  line-height: 24px;
  padding: 5px 11px;
  display: inline-block;
`;

export class LetsGetStartedPage extends React.Component<LetsGetStartedPageProps> {
  public render(): JSX.Element {
    return (
      <>
        <OBSectionHeader>Let’s get your Newsroom onto the Civil Network</OBSectionHeader>
        <OBSectionDescription>
          Next, you’ll be creating your Newsroom Smart Contract. You’ll be able to use Civil’s blockchain signing and
          publishing tools once your Newsroom Smart Contract is created.
        </OBSectionDescription>
        <BorderBox>
          <div>
            <Label>Newsroom name</Label>
            <Value>{this.props.name}</Value>
          </div>
          <div>
            <Label>Wallet connected</Label>
            <Smalltext>Your Public Wallet Address</Smalltext>
            <WalletAddress>{this.props.walletAddress}</WalletAddress>
          </div>
        </BorderBox>
      </>
    );
  }
}
