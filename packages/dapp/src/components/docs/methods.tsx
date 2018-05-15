import * as React from "react";
import * as sortBy from "sort-by";
import Method from "./method";

export interface MethodsProps {
  contract: any;
}

export default class Methods extends React.Component<MethodsProps> {
  public render(): JSX.Element {
    const { contract } = this.props;
    return (
      <div className="methods">
        {contract.abiDocs.sort(sortBy("type", "constant", "name")).map((method: any) => {
          return <Method key={`${contract.name}${method.signature}`} method={method} contract={contract} />;
        })}
      </div>
    );
  }
}
