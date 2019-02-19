import * as React from "react";
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
    if ((window as any).ethereum && (window as any).ethereum.isEnabled) {
      const metamaskEnabled = await (window as any).ethereum.isEnabled();
      this.setState({ metamaskEnabled });
    } else {
      this.setState({ metamaskEnabled: true });
    }
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
          if ((window as any).ethereum) {
            await (window as any).ethereum.enable();
            this.setState({ metamaskEnabled: true });
          }
        }}
      />
    );
  }
}
