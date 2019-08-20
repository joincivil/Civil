import * as React from "react";
import * as Sentry from "@sentry/browser";

export class ErrorBoundry extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }

  public componentDidCatch(error: Error, errorInfo: any): void {
    this.setState({ error });
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
      Sentry.captureException(error);
    });
  }

  public render(): JSX.Element | React.ReactNode {
    if (this.state.error) {
      // render fallback UI
      return (
        <div>
          <h3>Something went wrong!</h3>
          <a onClick={() => Sentry.showReportDialog()}>Report feedback</a>
        </div>
      );
    } else {
      // when there's not an error, render children untouched
      return this.props.children;
    }
  }
}
