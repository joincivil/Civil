import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";

const Image = styled.img`
  width: 100%;
  margin: 30px 0;
`;

export const IMAGE = "image";

export const image = (options: any): Plugin => {
  return {
    name: IMAGE,
    renderNode(props: any): JSX.Element | void {
      if (props.node.type === IMAGE) {
        const parentType = props.parent.type;
        return <Image src={props.node.data.get("src")} />;
      }
    },
  };
};
