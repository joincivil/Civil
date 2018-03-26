import { paragraph, PARAGRAPH } from "./paragraph";
import { header, HEADER } from "./header";
import { list, LIST, LIST_ITEM, UL_LIST, OL_LIST } from "./list";
import { blockquote, BLOCKQUOTE } from "./blockquote";
import { dropCap, DROP_CAP } from "./dropCap";
import { bold, BOLD } from "./bold";
import { italic, ITALIC } from "./italic";
import { strikeThrough, STRIKE_THROUGH } from "./strikeThrough";
import { link, LINK } from "./link";
import { pullQuote, PULL_QUOTE } from "./pullQuote";
import { image, IMAGE, IMAGE_BREAKOUT } from "./image";
import { toolbar, TOOL_BAR } from "./toolbar";
import { runIn, RUN_IN } from "./runin";

export type OnChangeFunc = (change: any) => any | void;
export type RenderEditorFunc = (props: object, editor: JSX.Element) => object | void;
export type SlateEventFunc = (event: Event, change: any, editor: JSX.Element) => any | void;
export type SlateRenderFunc = (props: any) => JSX.Element | JSX.ElementClass | void;

export interface PluginUtils {
  [key: string]: any;
}

export interface Plugin {
  name: string;
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
  renderPlaceholder?: SlateRenderFunc;
  changes?: PluginUtils;
  utils?: PluginUtils;
}

export const constants = {
  PARAGRAPH,
  HEADER,
  LIST,
  LIST_ITEM,
  UL_LIST,
  OL_LIST,
  BLOCKQUOTE,
  DROP_CAP,
  BOLD,
  ITALIC,
  STRIKE_THROUGH,
  LINK,
  PULL_QUOTE,
  IMAGE,
  IMAGE_BREAKOUT,
  TOOL_BAR,
  RUN_IN,
};

export const plugins = [
    paragraph({}),
    header({}),
    list({}),
    blockquote({}),
    dropCap({}),
    bold({}),
    italic({}),
    strikeThrough({}),
    link({}),
    pullQuote({}),
    image({}),
    toolbar({}),
    runIn({}),
] as Plugin[];
