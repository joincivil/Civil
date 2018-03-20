import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";

const Image = styled.img`
  width: 90vw;
  left: calc(-220px + calc(calc(805px - 90vw)/2));
  margin: 30px 0;
  position: relative;
`;

export const IMAGE_BREAKOUT = "image_breakout";

export const imageBreakout = (options: any): Plugin => {
  return {
    name: IMAGE_BREAKOUT,
    renderNode(props: any): JSX.Element | void {
      if (props.node.type === IMAGE_BREAKOUT) {
        const parentType = props.parent.type;
        return <Image src={props.node.data.get("src")} />;
      }
    },
  };
};
