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
                text: "A paragraph",
              },
            ],
          },
        ],
      },
    ],
  },
};

export const value = Value.fromJSON(valueJson);
