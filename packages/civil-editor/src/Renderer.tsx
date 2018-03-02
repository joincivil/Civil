import * as React from "react";
import {types} from "./types";

export const Renderer = (props: any) => {
    const { attributes, children, node } = props;
    const Component = types[node.type];
    return <Component {...attributes}>{children}</Component>;
};
