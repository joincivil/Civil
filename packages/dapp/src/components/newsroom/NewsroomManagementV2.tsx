import * as React from "react";
import { Newsroom } from "@joincivil/newsroom-manager";
import { getCivil } from "../../helpers/civilInstance";

export interface NewsroomManagementProps {
  match: any;
}

export default class NewsroomManagement extends React.Component<NewsroomManagementProps> {
  public render(): JSX.Element {
    const civil = getCivil();
    return <Newsroom civil={civil} address={this.props.match.params.newsroomAddress} theme={{}} />;
  }
}
