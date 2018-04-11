import * as React from "react";
import Contract from "./docs/contract";

export interface ContractPageState {
  listingState: string;
}
export interface ContractPageProps {
  match: any;
}

class ContractPage extends React.Component<ContractPageProps, ContractPageState> {
  public render(): JSX.Element {
    const contract = require("./docs/json/" + this.props.match.params.contract + ".json");
    return <Contract contract={contract} />;
  }
}

export default ContractPage;
