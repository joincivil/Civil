import * as React from "react";
import styled, { StyledComponentClass } from "styled-components";
import { Plugin } from "../plugins";
import EditList from "slate-edit-list";

const editList = EditList();

export const Ul = styled.ul`
  list-style: square;
  color: #5a5653;
`;

export const Li = styled.li`
  margin: 11px 0;
`;

export const Ol = styled.ol`
  color: #5a5653;
  font-family: 'Spectral', serif;
  font-size: 21px;
`;

export const LIST = "list";
export const UL_LIST = "ul_list";
export const OL_LIST = "ol_list";
export const LIST_ITEM = "list_item";

export const list = (options: any): Plugin => {
  return {
    name: LIST,
    ...editList,
    renderNode(props: any): JSX.Element | void {
      switch (props.node.type) {
        case UL_LIST: return <Ul {...props}/>;
        case OL_LIST: return <Ol {...props}/>;
        case LIST_ITEM: return <Li {...props}/>;
      }
    },
  };
};
