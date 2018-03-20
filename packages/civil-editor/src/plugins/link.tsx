import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";

export const Link = styled.a`
  text-decoration: none;
  color: #5a5653;
  border-bottom: 2px solid #30E8BD;
  cursor: pointer;
  &:hover{
    border-bottom: 2px solid #97F3DE;
  }
  &:visited{
    border-bottom: 2px solid #4066FF;
  }
`;

export const LINK = "link";

export const link = (options: any): Plugin => {
  return {
    name: LINK,
    renderMark(props: any): JSX.Element | void {
      if (props.mark.type === LINK) {
        return <Link href={props.mark.data.get("href")} target="_blank" {...props}/>;
      }
    },
  };
};
