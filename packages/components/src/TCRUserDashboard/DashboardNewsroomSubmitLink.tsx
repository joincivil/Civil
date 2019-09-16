import * as React from "react";
import { ErrorIcon } from "../icons";

import { Button, buttonSizes } from "../Button";
import { StyledDashboardNewsroom } from "./DashboardStyledComponents";

export interface DashboardNewsroomSubmitLinkProps {
  newsroomAddress: string;
}

export interface DashboardNewsroomSubmitLinkState {
  channelID: string;
  url: string;
}

export class DashboardNewsroomSubmitLink extends React.Component<
  DashboardNewsroomSubmitLinkProps,
  DashboardNewsroomSubmitLinkState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      channelID: "",
      url: "",
    };
  }

  public render(): JSX.Element {
    return (
      <>
        <input type="url" pattern="https://.*"></input>
        <Button size={buttonSizes.MEDIUM_WIDE} onClick={this.handleSubmit}>
          Submit Link
        </Button>
      </>
    );
  }

  private handleSubmit = () => {
    console.log("");
  };
}
