import * as React from "react";
import {types} from "./types";

// tslint:disable-next-line:variable-name
export const Renderer = (props: any) => {
    const { attributes, children, node } = props;
    // tslint:disable-next-line:variable-name
    const Node = types[node.type];
    return <Node {...attributes}>{children}</Node>;
};
