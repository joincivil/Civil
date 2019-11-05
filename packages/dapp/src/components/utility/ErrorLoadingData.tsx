import * as React from "react";

import { ErrorLoadingData } from "@joincivil/components";

import { StyledInPageMsgContainer } from "./styledComponents";

const ErrorLoadingDataMsg = () => {
  return (
    <StyledInPageMsgContainer>
      <ErrorLoadingData />
    </StyledInPageMsgContainer>
  );
};

export default ErrorLoadingDataMsg;
