import * as React from "react";

export interface ExecuteOnMountProps {
  onDidMount(): any;
  onError(err: any): any;
}

export class ExecuteOnMount extends React.Component<ExecuteOnMountProps> {
  public async componentDidMount(): Promise<void> {
    const { onDidMount, onError } = this.props;

    if (!onDidMount) {
      return;
    }

    try {
      await onDidMount();
    } catch (err) {
      if (onError) {
        onError(err);
      }
    }
  }

  public render(): JSX.Element {
    return <>{this.props.children}</>;
  }
}
