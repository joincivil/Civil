import * as React from "react";
import { connect } from "react-redux";

import { State } from "../../../redux/reducers";
import SubmitChallengeViewComponent from "./SubmitChallengeViewComponent";
import { SubmitChallengeProps, SubmitChallengeReduxProps } from "./SubmitChallengeTypes";

const mapStateToProps = (
  state: State,
  ownProps: SubmitChallengeProps,
): SubmitChallengeProps & SubmitChallengeReduxProps => {
  const { newsrooms } = state;
  const newsroom = newsrooms.get(ownProps.listingAddress);

  let newsroomName = "";
  let charterRevisionId;
  if (newsroom) {
    newsroomName = newsroom.wrapper.data.name;
    if (newsroom.wrapper.data.charterHeader) {
      charterRevisionId = newsroom.wrapper.data.charterHeader.revisionId;
    }
  }

  return {
    newsroomName,
    charterRevisionId,
    ...ownProps,
  };
};

export default connect(mapStateToProps)(SubmitChallengeViewComponent);
