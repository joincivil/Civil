import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";

const Image = styled.img`
  width: 90vw;
  left: calc(-220px + calc(calc(805px - 90vw)/2));
  margin: 30px 0;
  position: relative;
`;

export const imageBreakout = (options: any): Plugin => {
  return {
    renderNode(props: any): JSX.Element | void {
      if (props.node.type === "image_breakout") {
        const parentType = props.parent.type;
        return <Image src={props.node.data.get("src")} />;
      }
    },
  };
};
