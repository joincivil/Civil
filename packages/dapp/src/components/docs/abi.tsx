import * as React from "react";
import * as hljs from "highlight.js";

export interface AbiPropTypes {
  contract: any;
}
export default class Abi extends React.Component<AbiPropTypes> {
  private highlight: HTMLPreElement | null;
  constructor(props: AbiPropTypes) {
    super(props);
  }
  public componentDidMount(): void {
    hljs.highlightBlock(this.refs.highlight);
  }
  public render(): JSX.Element {
    const { contract } = this.props;
    return (
      <div className="abi">
        <h3>ABI</h3>
        <pre ref={highlight => (this.highlight = highlight)}>
          <code>{JSON.stringify(contract.abi, null, 2)}</code>
        </pre>
      </div>
    );
  }
}
