import * as React from "react";
import { Boost } from "./Boost";

export const BoostLoader: React.FunctionComponent = props => {
  const boostId = new URLSearchParams(window.location.search).get("boost");

  return boostId ? <Boost boostId={boostId} open={true} /> : <p>Error: Missing Boost ID</p>;
};
