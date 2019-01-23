import * as React from "react";

export interface ExecuteOnMountProps {
  onDidMount(): any;
}

export class ExecuteOnMount extends React.Component<ExecuteOnMountProps> {
  public async componentDidMount(): Promise<void> {
    const { onDidMount } = this.props;

    if (!onDidMount) {
      return;
    }

    onDidMount();
  }

  public render(): JSX.Element {
    return <>{this.props.children}</>;
  }
}
