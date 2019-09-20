import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { Boost } from "./Boost";

export interface BoostLoaderParams {
  boostId: string;
  payment?: string;
}

const BoostLoaderComponent = (props: RouteComponentProps<BoostLoaderParams>) => {
  return <Boost boostId={props.match.params.boostId} open={true} payment={!!props.match.params.payment} />;
};

export const BoostLoader: React.ComponentType = withRouter(BoostLoaderComponent);
