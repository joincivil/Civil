import * as React from "react";

export interface TabProps {
  title: string;
  isActive?: boolean;
  index?: number;
  children: React.ReactChild;
  onClick?(index: number): void;
}

export class Tab extends React.Component<TabProps> {
  public render(): JSX.Element {
    return <li onClick={this.onClick}>
      {this.props.title}
    </li>;
  }
  private onClick = () => {
    this.props.onClick!(this.props.index!)
  }
}
