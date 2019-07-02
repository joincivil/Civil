import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { State } from "../redux/reducers";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { List } from "immutable";

export interface ViewLogReduxProps {
  logs: List<string>;
}

class ViewLog extends React.Component<ViewLogReduxProps & RouteComponentProps<any>, {}> {
  constructor(props: ViewLogReduxProps & RouteComponentProps<any>) {
    super(props);
  }
  public render(): JSX.Element {
    return <div>{this.props.logs.map(log => <pre>{log}</pre>)}</div>;
  }
}

const mapStateToProps = (state: State): ViewLogReduxProps => {
  return { logs: state.log };
};

export default withRouter(connect(mapStateToProps)(ViewLog));
