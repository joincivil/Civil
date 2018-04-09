import * as React from "react";
// tslint:disable-next-line
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";
import InsertImages from "slate-drop-or-paste-images";
import { Image } from "./components/Image";

const instertImagesPlugin = InsertImages({
  extensions: ["png", "jpg", "jpeg"],
  insertImage: (transform: any, file: any) => {
    return transform.insertBlock({
      type: "image",
      isVoid: true,
      data: { file, style: IMAGE },
    });
  },
});

export const IMAGE = "image";
export const IMAGE_BREAKOUT = "image_breakout";

export const image = (options: any): Plugin => {
  return {
    name: IMAGE,
    ...instertImagesPlugin,
    renderNode(props: any): JSX.Element | void {
      if (props.node.type === IMAGE) {
        return <Image {...props} />;
      }
    },
    schema: {
      blocks: {
        [IMAGE]: {
          file: (): boolean => true,
          src: (): boolean => true,
          style: (style: string): boolean => [IMAGE, IMAGE_BREAKOUT].includes(style),
        },
      },
    },
  };
};
