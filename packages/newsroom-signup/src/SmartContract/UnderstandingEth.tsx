import * as React from "react";
import { OBSectionHeader, OBSectionDescription } from "@joincivil/components";

export class UnderstandingEth extends React.Component {
  public render(): JSX.Element {
    return (
      <>
        <OBSectionHeader>Understanding Ether (ETH)</OBSectionHeader>
        <OBSectionDescription>
          ETH is used to pay for gas fees to complete the transactions in your Newsroom Smart Contract, as well as to
          buy Civil tokens later in this process.
        </OBSectionDescription>
      </>
    );
  }
}
