import * as React from "react";
import { SlideCheckbox } from "../input/SlideCheckbox";

export interface LoadingPrefToggleProps {
  useGraphQL: boolean;
  onClick(): void;
}

export class LoadingPrefToggle extends React.Component<LoadingPrefToggleProps> {
  public render(): JSX.Element {
    return <SlideCheckbox onClick={this.props.onClick} checked={this.props.useGraphQL} />;
  }
}
