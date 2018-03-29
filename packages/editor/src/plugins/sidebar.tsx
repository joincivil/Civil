import * as React from "react";
// @ts-ignore
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";
import { CredibilityIndicators } from "./components/CredibilityIndicators";

const PullQuoteDiv = styled.div`
  box-sizing: border-box;
  width: 220px;
  position: relative;
  height: 100%;
`;

export const SIDEBAR = "SIDEBAR";

export const sidebar = (options: any): Plugin => {
  return {
    name: SIDEBAR,
    renderEditor(props: any): JSX.Element {
      return (<>
        <PullQuoteDiv id="civil-pull-quotes">
          <CredibilityIndicators {...props}/>
        </PullQuoteDiv>
        {props.children}
      </>);
    },
  };
};
