import * as React from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

import { EthAddress } from "@joincivil/core";

import { State } from "../../redux/reducers";
import { StyledPageContent } from "../utility/styledComponents";
import { List } from "immutable";
import { getCivil } from "../../helpers/civilInstance";
import { Button, TextInput } from "@joincivil/components";
import Delegate from "./Delegate";

export interface DelegatesProps {
  match?: any;
  history: any;
}

export interface DelegatesReduxProps {
  userAcct: EthAddress;
}

export interface DelegatesState {
  delegateAddresses: List<EthAddress>;
  newDelegateName: string;
}

class Delegates extends React.Component<DelegatesProps & DelegatesReduxProps, DelegatesState> {
  constructor(props: DelegatesProps & DelegatesReduxProps) {
    super(props);
    this.state = {
      delegateAddresses: List<EthAddress>(),
      newDelegateName: "",
    };
  }
  public async componentDidMount(): Promise<void> {
    const civil = getCivil();
    (await civil.delegatesCreated()).subscribe(e => {
      console.log("e: ", e);
      this.setState({ delegateAddresses: this.state.delegateAddresses.push(e.args.delegateAddress) });
    });
  }
  public render(): JSX.Element {
    return (
      <StyledPageContent>
        <Helmet title="Delegates" />
        <TextInput name="newDelegateName" onChange={this.onNewDelegateNameChange} />
        <Button onClick={this.onCreateDelegateClicked}>Create Delegate</Button>
        <br />
        {this.state.delegateAddresses.map(address => <Delegate delegateAddress={address!} />)}
      </StyledPageContent>
    );
  }

  public onNewDelegateNameChange = async (name: any, value: any): Promise<void> => {
    console.log("lets go click!");
    this.setState({ newDelegateName: value });
  };

  public onCreateDelegateClicked = async (ev: any): Promise<void> => {
    console.log("lets go click!");
    const civil = getCivil();
    await civil.createDelegate(this.state.newDelegateName);
  };
}

const mapStateToProps = (state: State, ownProps: DelegatesProps): DelegatesProps & DelegatesReduxProps => {
  const { user } = state.networkDependent;
  const userAcct = user && user.account && user.account.account;
  return {
    ...ownProps,
    userAcct,
  };
};

export default connect(mapStateToProps)(Delegates);
