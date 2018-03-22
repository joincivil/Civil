export const olJson = {
  document: {
    nodes: [
      {
        object: "block",
        type: "ol_list",
        nodes: [
          {
            object: "block",
            type: "list_item",
            nodes: [
              {
                object: "block",
                type: "paragraph",
                nodes: [
                  {
                    object: "text",
                    leaves: [
                      {
                        text: "First item in the list is this item, bet you didn't expect that",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            object: "block",
            type: "list_item",
            nodes: [
              {
                object: "block",
                type: "paragraph",
                nodes: [
                  {
                    object: "text",
                    leaves: [{
                      text: "Second item in the list",
                    }],
                  },
                ],
              },
              {
                object: "block",
                type: "ol_list",
                nodes: [
                  {
                    object: "block",
                    type: "list_item",
                    nodes: [
                      {
                        object: "block",
                        type: "paragraph",
                        nodes: [
                          {
                            object: "text",
                            leaves: [{
                              text: "Second item in the list has this lovelly nested list. pretty cool, right?",
                            }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            object: "block",
            type: "list_item",
            nodes: [
              {
                object: "block",
                type: "paragraph",
                nodes: [
                  {
                    object: "text",
                    leaves: [
                      {
                        text: "It is still poorer than the average in Arkansas, which is among the poorest states in the nation",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};
