import * as React from "react";
// tslint:disable-next-line
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";
import { Title } from "./components/Title";

export const TITLE = "Title";

export const Wrappper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  position: relative;
`;

export const title = (options: any): Plugin => {
  return {
    name: TITLE,
    renderEditor(props: any): JSX.Element {
      return (<>
        <Title {...props}/>
        <Wrappper>
          {props.children}
        </Wrappper>
      </>);
    },
  };
};
