import * as React from "react";
import { ShareEmailIcon } from "../icons";

export interface ShareEmailProps {
  label?: string;
  handleShare(ev: any): void;
}

export class ShareEmail extends React.Component<ShareEmailProps> {
  public render(): JSX.Element {
    return (
      <a onClick={ev => this.handleShare(ev)}>
        <ShareEmailIcon />
        {this.props.label || ""}
      </a>
    );
  }

  private handleShare = (ev: any) => {
    ev.preventDefault();
    this.props.handleShare(ev);
  };
}
