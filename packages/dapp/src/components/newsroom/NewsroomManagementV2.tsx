import * as React from "react";
import { CivilContext, ICivilContext } from "@joincivil/components";
import { ethereumEnable } from "@joincivil/utils";
import { Newsroom } from "@joincivil/newsroom-manager";

export interface NewsroomManagementProps {
  match: any;
}

export interface NewsroomManagementState {
  metamaskEnabled?: boolean;
}

export default class NewsroomManagement extends React.Component<NewsroomManagementProps, NewsroomManagementState> {
  public static contextType = CivilContext;
  public context: ICivilContext;

  constructor(props: NewsroomManagementProps) {
    super(props);
    this.state = {};
  }

  public async componentDidMount(): Promise<void> {
    this.setState({ metamaskEnabled: !!(await ethereumEnable()) });
  }
  public render(): JSX.Element {
    const { civil } = this.context;
    return (
      <Newsroom
        civil={civil}
        address={this.props.match.params.newsroomAddress}
        metamaskEnabled={this.state.metamaskEnabled}
        allSteps={true}
        enable={async () => {
          this.setState({ metamaskEnabled: !!(await ethereumEnable()) });
        }}
      />
    );
  }
}
