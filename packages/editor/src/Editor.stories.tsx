import { storiesOf } from "@storybook/react";
import * as React from "react";
import { CivilEditor } from "./Editor";
import { plugins } from "./plugins";
import { paragraphJson } from "./storyFixtures/paragraph";
import { headerJson } from "./storyFixtures/header";
import { ulJson } from "./storyFixtures/ul";
import { olJson } from "./storyFixtures/ol";
import { blockquoteJson } from "./storyFixtures/blockquote";
import { dropCapJson } from "./storyFixtures/dropCap";
import { boldJson } from "./storyFixtures/bold";
import { runinJson } from "./storyFixtures/runin";
import { italicJson } from "./storyFixtures/italic";
import { strikeThroughJson } from "./storyFixtures/strikeThrough";
import { linkJson } from "./storyFixtures/link";
import { pullQuoteJson } from "./storyFixtures/pullquote";
import { imageJson } from "./storyFixtures/image";
import { imageBreakoutJson } from "./storyFixtures/imagebreakout";
import {
  credibilityIndicatorsJson1,
  credibilityIndicatorsJson2,
  credibilityIndicatorsJson3,
  credibilityIndicatorsJson4,
} from "./storyFixtures/credibilityIndicators";
import { titleJson } from "./storyFixtures/title";

const onChange = (value: any): any => {
  return;
};

storiesOf("Civil Display View", module)
  .add("paragraph", () => {
    const initialValue = paragraphJson;
    return <CivilEditor value={initialValue} onChange={onChange} plugins={plugins} readOnly />;
  })
  .add("header", () => {
    const initialValue = headerJson;
    return <CivilEditor value={initialValue} onChange={onChange} plugins={plugins} readOnly />;
  })
  .add("unordered list", () => {
    const initialValue = ulJson;
    return <CivilEditor value={initialValue} onChange={onChange} plugins={plugins} readOnly />;
  })
  .add("ordered list", () => {
    const initialValue = olJson;
    return <CivilEditor value={initialValue} onChange={onChange} plugins={plugins} readOnly />;
  })
  .add("blockquote", () => {
    const initialValue = blockquoteJson;
    return <CivilEditor value={initialValue} onChange={onChange} plugins={plugins} readOnly />;
  })
  .add("drop cap", () => {
    const initialValue = dropCapJson;
    return <CivilEditor value={initialValue} onChange={onChange} plugins={plugins} readOnly />;
  })
  .add("bold", () => {
    const initialValue = boldJson;
    return <CivilEditor value={initialValue} onChange={onChange} plugins={plugins} readOnly />;
  })
  .add("run in", () => {
    const initialValue = runinJson;
    return <CivilEditor value={initialValue} onChange={onChange} plugins={plugins} readOnly />;
  })
  .add("italic", () => {
    const initialValue = italicJson;
    return <CivilEditor value={initialValue} onChange={onChange} plugins={plugins} readOnly />;
  })
  .add("strike through", () => {
    const initialValue = strikeThroughJson;
    return <CivilEditor value={initialValue} onChange={onChange} plugins={plugins} readOnly />;
  })
  .add("link", () => {
    const initialValue = linkJson;
    return <CivilEditor value={initialValue} onChange={onChange} plugins={plugins} readOnly />;
  })
  .add("pull quote", () => {
    const initialValue = pullQuoteJson;
    return <CivilEditor value={initialValue} onChange={onChange} plugins={plugins} readOnly />;
  })
  .add("image", () => {
    const initialValue = imageJson;
    return <CivilEditor value={initialValue} onChange={onChange} plugins={plugins} readOnly />;
  })
  .add("image breakout", () => {
    const initialValue = imageBreakoutJson;
    return <CivilEditor value={initialValue} onChange={onChange} plugins={plugins} readOnly />;
  })
  .add("1 credibility indicator", () => {
    const initialValue = credibilityIndicatorsJson1;
    return <CivilEditor value={initialValue} onChange={onChange} plugins={plugins} readOnly />;
  })
  .add("2 credibility indicator", () => {
    const initialValue = credibilityIndicatorsJson2;
    return <CivilEditor value={initialValue} onChange={onChange} plugins={plugins} readOnly />;
  })
  .add("3 credibility indicator", () => {
    const initialValue = credibilityIndicatorsJson3;
    return <CivilEditor value={initialValue} onChange={onChange} plugins={plugins} readOnly />;
  })
  .add("4 credibility indicator", () => {
    const initialValue = credibilityIndicatorsJson4;
    return <CivilEditor value={initialValue} onChange={onChange} plugins={plugins} readOnly />;
  })
  .add("title and lead in", () => {
    const initialValue = titleJson;
    return <CivilEditor value={initialValue} onChange={onChange} plugins={plugins} readOnly />;
  });

storiesOf("Civil Editable View", module).add("full editor", () => {
  const initialValue = paragraphJson;
  return <CivilEditor value={initialValue} onChange={onChange} plugins={plugins} readOnly={false} />;
});
