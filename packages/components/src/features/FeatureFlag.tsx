import * as React from "react";
import { CivilContext, ICivilContext } from "../context";

export interface FeatureFlagProps {
  feature: string;
  replacement?: JSX.Element;
  children: any;
}
export class FeatureFlag extends React.Component<FeatureFlagProps> {
  public static contextType: React.Context<ICivilContext> = CivilContext;

  public render(): JSX.Element {
    if (this.context.features.featureEnabled(this.props.feature)) {
      return <>{this.props.children}</>;
    } else {
      return <>{this.props.replacement}</>;
    }
  }
}
