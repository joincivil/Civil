import * as React from "react";
import { urlConstants as links } from "@joincivil/utils";

export const ApprovedNewsroomText: React.FunctionComponent = props => {
  return (
    <p>
      This Newsroom maintains the standards and journalistic principles set by the{" "}
      <a href={links.CONSTITUTION} target="_blank">
        Civil Constitution
      </a>{" "}
      and is approved by the community.
    </p>
  );
};

export const ChallengedNewsroomText: React.FunctionComponent = props => {
  return (
    <p>
      This Newsroom is currently being challenged by a community member who perceives they violated{" "}
      <a href={links.CONSTITUTION} target="_blank">
        Civil Constitution
      </a>
      .{" "}
      <a href="#TODO" target="_blank">
        Learn more
      </a>{" "}
      about the vetting process.
    </p>
  );
};
