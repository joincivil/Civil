import * as React from "react";
import { connect, DispatchProp } from "react-redux";

import { ErrorLoadingData } from "@joincivil/components";

import { State } from "../../redux/reducers";
import { toggleUseGraphQL } from "../../redux/actionCreators/ui";

import { StyledInPageMsgContainer } from "./styledComponents";

export interface ErrorLoadingDataMsgReduxProps {
  useGraphQL: boolean;
}

const ErrorLoadingDataMsg = (props: ErrorLoadingDataMsgReduxProps & DispatchProp<any>) => {
  return (
    <StyledInPageMsgContainer>
      <ErrorLoadingData
        useGraphQL={props.useGraphQL}
        toggleGraphQL={async (): Promise<any> => {
          props.dispatch!(await toggleUseGraphQL());
        }}
      />
    </StyledInPageMsgContainer>
  );
};

const mapStateToProps = (state: State): ErrorLoadingDataMsgReduxProps => {
  const useGraphQL = state.useGraphQL;

  return {
    useGraphQL,
  };
};

export default connect(mapStateToProps)(ErrorLoadingDataMsg);
