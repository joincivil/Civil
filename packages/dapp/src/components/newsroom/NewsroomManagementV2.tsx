import * as React from "react";
import { isEthereumEnabled, enableEthereum } from "@joincivil/utils";
import { Newsroom } from "@joincivil/newsroom-manager";
import { getCivil } from "../../helpers/civilInstance";

export interface NewsroomManagementProps {
  match: any;
}

export interface NewsroomManagementState {
  metamaskEnabled?: boolean;
}

export default class NewsroomManagement extends React.Component<NewsroomManagementProps, NewsroomManagementState> {
  constructor(props: NewsroomManagementProps) {
    super(props);
    this.state = {};
  }

  public async componentDidMount(): Promise<void> {
    this.setState({ metamaskEnabled: await isEthereumEnabled() });
  }
  public render(): JSX.Element {
    const civil = getCivil();
    return (
      <Newsroom
        civil={civil}
        address={this.props.match.params.newsroomAddress}
        metamaskEnabled={this.state.metamaskEnabled}
        allSteps={true}
        enable={async () => {
          await enableEthereum();
          this.setState({ metamaskEnabled: true });
        }}
      />
    );
  }
}
