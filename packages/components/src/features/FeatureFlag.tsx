import * as React from "react";
import { CivilContext, ICivilContext } from "../context";

export interface FeatureFlagProps {
  feature: string;
  replacement?: JSX.Element
  replacementComponent?: React.ComponentType;
  children: any;
}
export class FeatureFlag extends React.Component<FeatureFlagProps> {
  public static contextType: React.Context<ICivilContext> = CivilContext;

  public render(): JSX.Element {
    const { feature, children, replacement, replacementComponent } = this.props;

    if (this.context.features.featureEnabled(feature)) {
      return <>{children}</>;
    } else if (replacementComponent) {
      const Replacement = replacementComponent;
      return <Replacement />;
    } else {
      return <>{replacement}</>;
    }
  }
}
