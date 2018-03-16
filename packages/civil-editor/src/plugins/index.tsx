import * as React from "react";
import { paragraph } from "./paragraph";
import { header } from "./header";
import { list } from "./list";
import { blockquote } from "./blockquote";
import { dropCap } from "./dropCap";
import { bold } from "./bold";
import { italic } from "./italic";
import { strikeThrough } from "./strikeThrough";
import { link } from "./link";
import { pullQuote } from "./pullQuote";
import { image } from "./image";
import { imageBreakout } from "./imageBreakout";
import EditList from "slate-edit-list";

export type OnChangeFunc = (change: any) => any | void;
export type RenderEditorFunc = (props: object, editor: JSX.Element) => object | void;
export type SlateEventFunc = (event: Event, change: any, editor: JSX.Element) => any | void;
export type SlateRenderFunc = (props: any) => JSX.Element | JSX.ElementClass | void;

export interface Plugin {
  schema?: object;
  renderEditor?: RenderEditorFunc;
  onChange?: OnChangeFunc;
  onBeforeInput?: SlateEventFunc;
  onBlur?: SlateEventFunc;
  onFocus?: SlateEventFunc;
  onCopy?: SlateEventFunc;
  onCut?: SlateEventFunc;
  onDrop?: SlateEventFunc;
  onKeyDown?: SlateEventFunc;
  onKeyUp?: SlateEventFunc;
  onPaste?: SlateEventFunc;
  onSelect?: SlateEventFunc;
  renderNode?: SlateRenderFunc;
  renderMark?: SlateRenderFunc;
}

export const plugins = [
    paragraph({}),
    header({}),
    EditList(),
    list({}),
    blockquote({}),
    dropCap({}),
    bold({}),
    italic({}),
    strikeThrough({}),
    link({}),
    pullQuote({}),
    image({}),
    imageBreakout({}),
] as Plugin[];
