import * as hljs from "highlight.js";
import * as React from "react";

export interface AbiPropTypes {
  contract: any;
}
export default class Abi extends React.Component<AbiPropTypes> {
  private highlight: React.RefObject<any>;
  constructor(props: AbiPropTypes) {
    super(props);
    this.highlight = React.createRef();
  }
  public componentDidMount(): void {
    hljs.highlightBlock(this.highlight.current);
  }
  public render(): JSX.Element {
    const { contract } = this.props;
    return (
      <div className="abi">
        <h3>ABI</h3>
        <pre ref={this.highlight}>
          <code>{JSON.stringify(contract.abi, null, 2)}</code>
        </pre>
      </div>
    );
  }
}
