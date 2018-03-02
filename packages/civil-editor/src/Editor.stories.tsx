import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Value } from "slate";
import { CivilEditor } from "./Editor";
import { Renderer } from "./Renderer";


const initialValue = Value.fromJSON({
    document: {
      nodes: [
        {
          object: "block",
          type: "paragraph",
          nodes: [
            {
              object: "text",
              leaves: [
                {
                  text: "A line of text in a paragraph.",
                },
              ],
            },
          ],
        },
      ],
    },
  });

storiesOf("CivilEditor", module)
    .add("main", () => {
        const onChange = (value: any): any => {};
        return <CivilEditor
          value={initialValue}
          onChange={onChange}
          renderNode={Renderer}
        />
    });
