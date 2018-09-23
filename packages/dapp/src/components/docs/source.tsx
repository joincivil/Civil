import * as hljs from "highlight.js";
import * as React from "react";

// import hljsDefineSolidity from "highlightjs-solidity"
// import "../css/hljs-atom-one.css"

// hljsDefineSolidity(hljs);

export interface SourceProps {
  contract: any;
}

export interface SourceState {
  renderHack: boolean;
}

export default class Source extends React.Component<SourceProps, SourceState> {
  private highlight: React.RefObject<any>;
  constructor(props: SourceProps) {
    super(props);
    this.state = {
      renderHack: false,
    };
    this.highlight = React.createRef();
  }
  public componentDidMount(): void {
    hljs.highlightBlock(this.highlight.current);
  }
  public componentWillReceiveProps(): void {
    this.state = { renderHack: true };
    setTimeout(() => {
      this.setState({ renderHack: false });
      hljs.highlightBlock(this.highlight.current);
    }, 0);
  }
  public render(): JSX.Element {
    const { contract } = this.props;
    return (
      <div className="source">
        {!this.state.renderHack && (
          <pre ref={this.highlight}>
            <code>{contract.source}</code>
          </pre>
        )}
      </div>
    );
  }
}
