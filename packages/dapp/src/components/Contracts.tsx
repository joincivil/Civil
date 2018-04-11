import * as React from "react";
import { Link } from "react-router-dom";

import contracts from "./docs";

export interface ContractsState {
  listingState: string;
}
export interface ContractsProps {
  match: any;
}

class Contracts extends React.Component<ContractsProps, ContractsState> {
  public render(): JSX.Element {
    const list = contracts.map((contract: any) => {
      const link: string = "contract/" + contract.name;
      return (
        <Link to={link} key={contract.name}>
          {contract.name}
          <br />
        </Link>
      );
    });
    return <div>{list}</div>;
  }
}

export default Contracts;
