import { Value } from "slate";

export const valueJson = {
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
                object: "leaf",
                text: "",
              },
            ],
          },
        ],
      },
    ],
  },
};

export const value = Value.fromJSON(valueJson);
