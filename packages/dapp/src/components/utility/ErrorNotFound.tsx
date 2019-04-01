import * as React from "react";
import { Link } from "react-router-dom";

import { ErrorNotFound } from "@joincivil/components";

import { StyledInPageMsgContainer } from "./styledComponents";

const ErrorNotFoundMsg: React.FunctionComponent = props => {
  const defaultCopy = "We could not find the page you were looking for.";
  return (
    <StyledInPageMsgContainer>
      <ErrorNotFound>
        {props.children || defaultCopy}
        <p>
          Please check the URL or view <Link to="/registry">The Civil Registry</Link> to view all current newsroom
          listings.
        </p>
      </ErrorNotFound>
    </StyledInPageMsgContainer>
  );
};

export default ErrorNotFoundMsg;
