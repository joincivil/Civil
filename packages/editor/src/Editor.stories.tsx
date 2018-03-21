import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Value } from "slate";
import { CivilEditor } from "./Editor";
import { plugins } from "./plugins";
import { paragraphJson } from "./storyFixtures/paragraph";
import { headerJson } from "./storyFixtures/header";
import { ulJson } from "./storyFixtures/ul";
import { olJson } from "./storyFixtures/ol";
import { blockquoteJson } from "./storyFixtures/blockquote";
import { dropCapJson } from "./storyFixtures/dropCap";
import { boldJson } from "./storyFixtures/bold";
import { italicJson } from "./storyFixtures/italic";
import { strikeThroughJson } from "./storyFixtures/strikeThrough";
import { linkJson } from "./storyFixtures/link";
import { pullQuoteJson } from "./storyFixtures/pullquote";
import { imageJson } from "./storyFixtures/image";
import { imageBreakoutJson } from "./storyFixtures/imagebreakout";

const onChange = (value: any): any => { return; };

storiesOf("Civil Display View", module)
    .add("paragraph", () => {
        const initialValue = Value.fromJSON(paragraphJson);
        return (<CivilEditor
            value={initialValue}
            onChange={onChange}
            plugins={plugins}
            readOnly
          />);
    }).add("header", () => {
      const initialValue = Value.fromJSON(headerJson);
      return (<CivilEditor
          value={initialValue}
          onChange={onChange}
          plugins={plugins}
          readOnly
        />);
    }).add("unordered list", () => {
      const initialValue = Value.fromJSON(ulJson);
      return (<CivilEditor
          value={initialValue}
          onChange={onChange}
          plugins={plugins}
          readOnly
        />);
    }).add("ordered list", () => {
      const initialValue = Value.fromJSON(olJson);
      return (<CivilEditor
          value={initialValue}
          onChange={onChange}
          plugins={plugins}
          readOnly
        />);
    }).add("blockquote", () => {
      const initialValue = Value.fromJSON(blockquoteJson);
      return (<CivilEditor
          value={initialValue}
          onChange={onChange}
          plugins={plugins}
          readOnly
        />);
    }).add("drop cap", () => {
      const initialValue = Value.fromJSON(dropCapJson);
      return (<CivilEditor
          value={initialValue}
          onChange={onChange}
          plugins={plugins}
          readOnly
        />);
    }).add("bold", () => {
      const initialValue = Value.fromJSON(boldJson);
      return (<CivilEditor
          value={initialValue}
          onChange={onChange}
          plugins={plugins}
          readOnly
        />);
    }).add("italic", () => {
      const initialValue = Value.fromJSON(italicJson);
      return (<CivilEditor
          value={initialValue}
          onChange={onChange}
          plugins={plugins}
          readOnly
        />);
    }).add("strike through", () => {
      const initialValue = Value.fromJSON(strikeThroughJson);
      return (<CivilEditor
          value={initialValue}
          onChange={onChange}
          plugins={plugins}
          readOnly
        />);
    }).add("link", () => {
      const initialValue = Value.fromJSON(linkJson);
      return (<CivilEditor
          value={initialValue}
          onChange={onChange}
          plugins={plugins}
          readOnly
        />);
    }).add("pull quote", () => {
      const initialValue = Value.fromJSON(pullQuoteJson);
      return (<CivilEditor
          value={initialValue}
          onChange={onChange}
          plugins={plugins}
          readOnly
        />);
    }).add("image", () => {
      const initialValue = Value.fromJSON(imageJson);
      return (<CivilEditor
          value={initialValue}
          onChange={onChange}
          plugins={plugins}
          readOnly
        />);
    }).add("image breakout", () => {
      const initialValue = Value.fromJSON(imageBreakoutJson);
      return (<CivilEditor
          value={initialValue}
          onChange={onChange}
          plugins={plugins}
          readOnly
        />);
    });

storiesOf("Civil Editable View", module)
    .add("full editor", () => {
      const initialValue = Value.fromJSON(paragraphJson);
      return (<CivilEditor
          value={initialValue}
          onChange={onChange}
          plugins={plugins}
          readOnly={false}
      />);
    });
