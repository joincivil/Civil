import * as React from "react";
import styled from "styled-components";
import { State } from "../../redux/reducers";
import { connect, DispatchProp } from "react-redux";
import { PageView, ViewModule, ViewModuleHeader } from "../utility/ViewModules";
import { SetAppellate } from "./SetAppellate";

const StyledSpan = styled.span`
  font-weight: bold;
  margin: 0 10px 0 0;
`;

export interface CouncilPageProps {
  appellateAddr: string;
  appellateMembers: string[];
  controllerAddr: string;
}

class Government extends React.Component<CouncilPageProps & DispatchProp<any>> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <PageView>
        <ViewModule>
          <ViewModuleHeader />
          <div>
            <StyledSpan>Appellate:</StyledSpan> {this.props.appellateAddr}
          </div>
          <div>
            <StyledSpan>Appellate Members:</StyledSpan> {this.props.appellateMembers}
          </div>
          <div>
            <StyledSpan>Controller:</StyledSpan> {this.props.controllerAddr}
          </div>
        </ViewModule>
        <SetAppellate />
      </PageView>
    );
  }
}

const mapToStateToProps = (state: State): CouncilPageProps => {
  const appellateAddr = state.networkDependent.appellate;
  const controllerAddr = state.networkDependent.controller;
  const appellateMembers = state.networkDependent.appellateMembers;
  return { appellateAddr, appellateMembers, controllerAddr };
};

export default connect(mapToStateToProps)(Government);
