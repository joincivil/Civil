import * as React from "react";
import * as hljs from "highlight.js";

export interface AbiPropTypes {
  contract: any;
}
export default class Abi extends React.Component<AbiPropTypes> {
  public componentDidMount(): void {
    hljs.highlightBlock(this.refs.highlight);
  }
  public render(): JSX.Element {
    const { contract } = this.props;
    return (
      <div className="abi">
        <h3>ABI</h3>
        <pre ref="highlight">
          <code>{JSON.stringify(contract.abi, null, 2)}</code>
        </pre>
      </div>
    );
  }
}
