import * as React from "react";
import { EthAddress, CharterData, TxHash, NewsroomInstance } from "@joincivil/core";
import { NextBack } from "../styledComponents";
import { LetsGetStartedPage } from "./LetsGetStartedPage";
import { UnderstandingEth } from "./UnderstandingEth";
import { CreateNewsroomContract } from "./CreateNewsroomContract";
import { AddMembersToContract } from "./AddMembersToContract";
import { Mutation, MutationFunc } from "react-apollo";
import { getCharterQuery } from "../queries";
import { SaveAddressMutation, SaveTxMutation } from "../mutations";
import { CivilContext, CivilContextValue } from "../CivilContext";

export interface SmartContractProps {
  currentStep: number;
  profileWalletAddress?: EthAddress;
  charter: Partial<CharterData>;
  userIsOwner?: boolean;
  newsroomAddress?: EthAddress;
  newsroomDeployTxHash?: TxHash;
  newsroom?: NewsroomInstance;
  navigate(go: 1 | -1): void;
  updateCharter(charter: Partial<CharterData>): void;
}

export class SmartContract extends React.Component<SmartContractProps> {
  public getDisabled(index: number): () => boolean {
    const functions = [
      () => {
        return false;
      },
      () => {
        return false;
      },
      () => {
        return !this.props.newsroomAddress;
      },
      () => {
        return !this.props.newsroomAddress;
      },
    ];

    return functions[index];
  }

  public renderButtons(): JSX.Element | void {
    return <NextBack navigate={this.props.navigate} nextDisabled={this.getDisabled(this.props.currentStep)} />;
  }
  public renderCurrentStep(): JSX.Element {
    const steps = [
      <LetsGetStartedPage walletAddress={this.props.profileWalletAddress} name={this.props.charter.name!} />,
      <CivilContext.Consumer>
        {(value: CivilContextValue) => {
          return <UnderstandingEth civil={value.civil} />;
        }}
      </CivilContext.Consumer>,
      <Mutation
        mutation={SaveTxMutation}
        refetchQueries={[
          {
            query: getCharterQuery,
          },
        ]}
      >
        {(saveTx: MutationFunc) => {
          return (
            <Mutation
              mutation={SaveAddressMutation}
              refetchQueries={[
                {
                  query: getCharterQuery,
                },
              ]}
            >
              {(saveAddress: MutationFunc) => {
                return (
                  <CreateNewsroomContract
                    charter={this.props.charter!}
                    updateCharter={this.props.updateCharter}
                    newsroomAddress={this.props.newsroomAddress}
                    newsroomDeployTxHash={this.props.newsroomDeployTxHash}
                    newsroom={this.props.newsroom}
                    saveTx={saveTx}
                    saveAddress={saveAddress}
                  />
                );
              }}
            </Mutation>
          );
        }}
      </Mutation>,
      <AddMembersToContract
        charter={this.props.charter!}
        newsroom={this.props.newsroom}
        updateCharter={this.props.updateCharter}
        profileWalletAddress={this.props.profileWalletAddress}
      />,
    ];
    return steps[this.props.currentStep];
  }
  public render(): JSX.Element {
    return (
      <>
        {this.renderCurrentStep()}
        {this.renderButtons()}
      </>
    );
  }
}
