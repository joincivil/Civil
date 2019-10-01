import * as React from "react";
import { ShareTwitterIcon } from "../icons";

export interface ShareTwitterProps {
  label?: string;
  handleShare(ev: any): void;
}

export class ShareTwitter extends React.Component<ShareTwitterProps> {
  public render(): JSX.Element {
    return (
      <a onClick={ev => this.handleShare(ev)}>
        <ShareTwitterIcon />
        {this.props.label || ""}
      </a>
    );
  }

  private handleShare = (ev: any) => {
    ev.preventDefault();
    this.props.handleShare(ev);
  };
}
