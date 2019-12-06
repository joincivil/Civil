import * as React from "react";
import { NewsroomInstance } from "@joincivil/core";
import { EthAddress, CharterData, TxHash } from "@joincivil/typescript-types";
import { NextBack } from "../styledComponents";
import { LetsGetStartedPage } from "./LetsGetStartedPage";
import { UnderstandingEth } from "./UnderstandingEth";
import { CreateNewsroomContract } from "./CreateNewsroomContract";
import { AddMembersToContract } from "./AddMembersToContract";
import { Mutation, MutationFunc } from "react-apollo";
import { getCharterQuery } from "../queries";
import { SaveAddressMutation, SaveTxMutation } from "../mutations";
import { CivilContext, ICivilContext } from "@joincivil/components";

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
  public static contextType = CivilContext;
  public context: ICivilContext;

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
      <UnderstandingEth civil={this.context.civil} />,
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
