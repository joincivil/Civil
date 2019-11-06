import { storiesOf } from "@storybook/react";
import * as React from "react";
import { CollapsibleContainer } from "./CollapsibleContainer";
import { TasksText, NewsroomsText, HistoryText } from "./textComponents";
import { StyledCollapsibleContainerHeader } from "./CollapsibleContainerStyled";
import { TasksTitle, NewsroomsTitle, HistoryTitle } from "./CollapsibleContainerTitles";

storiesOf("Common / CollapsibleContainers", module)
  .add("Single CollapsibleContainer", () => {
    return (
      <CollapsibleContainer Title={<span>"Index"</span>}>
        <p>Some Content</p>
      </CollapsibleContainer >
    )
  })
  .add("Unstyled Stacked Large CollapsibleContainer", () => {
    return (
      <>
        <CollapsibleContainer Title={<TasksText />}>
        <p>Some Content</p>
      </CollapsibleContainer>
        <CollapsibleContainer Title={<NewsroomsText />}>
        <p>Some other Content</p>
      </CollapsibleContainer>
        <CollapsibleContainer Title={<HistoryText/>}>
        <p>3rd bit of Content</p>
      </CollapsibleContainer>
      </>
    )
  })
  .add("Stacked Large StyledCollapsibleContainerHeader", () => {
    return (
      <>
        <CollapsibleContainer Title={TasksTitle} Header={StyledCollapsibleContainerHeader}>
          <p>Some Content</p>
        </CollapsibleContainer>
        <CollapsibleContainer Title={NewsroomsTitle} Header={StyledCollapsibleContainerHeader}>
          <p>Some other Content</p>
        </CollapsibleContainer>
        <CollapsibleContainer Title={HistoryTitle} Header={StyledCollapsibleContainerHeader}>
          <p>3rd bit of Content</p>
        </CollapsibleContainer>
      </>
    )
  })
