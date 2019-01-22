import * as React from "react";
import { LoadingIndicator, LoadingIndicatorProps } from "@joincivil/components";

import { StyledInPageMsgContainer, StyledMsgLargeCopy } from "./styledComponents";

const LoadingMsg: React.SFC<LoadingIndicatorProps> = props => {
  const defaultCopy = "Loading";
  return (
    <StyledInPageMsgContainer>
      <LoadingIndicator width={props.width} height={props.height} />
      <StyledMsgLargeCopy>{props.children || defaultCopy}</StyledMsgLargeCopy>
    </StyledInPageMsgContainer>
  );
};

export default LoadingMsg;
