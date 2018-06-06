import * as React from "react";
import { Newsroom } from "./Newsroom";

export interface NewsroomManagementProps {
  match: any;
}

export default class NewsroomManagement extends React.Component<NewsroomManagementProps> {
  public render(): JSX.Element {
    return <Newsroom address={this.props.match.params.newsroomAddress} />;
  }
}
