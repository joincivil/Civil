import * as React from "react";

import { ErrorLoadingData } from "@joincivil/components";

import { StyledInPageMsgContainer } from "./styledComponents";

const ErrorLoadingDataMsg = () => {
  return (
    <StyledInPageMsgContainer>
      <ErrorLoadingData
        useGraphQL={false}
      />
    </StyledInPageMsgContainer>
  );
};

export default ErrorLoadingDataMsg;
