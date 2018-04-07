export const ulJson = {
  document: {
    nodes: [
      {
        object: "block",
        type: "ul_list",
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
                        text: "first item in the list is this item, bet you didn't expect that",
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
                        text: "second item in the list",
                      },
                    ],
                  },
                ],
              },
              {
                object: "block",
                type: "ul_list",
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
                                text: "second item in the list has this lovelly nested list. pretty cool, right?",
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
                        text:
                          "it is still poorer than the average in Arkansas, which is among the poorest states in the nation",
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
