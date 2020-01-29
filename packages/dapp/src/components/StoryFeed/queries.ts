import gql from "graphql-tag";

export const STORY_FEED_QUERY = gql`
  query Storyfeed($cursor: String, $filter: StoryfeedFilterInput) {
    postsStoryfeed(first: 15, after: $cursor, filter: $filter) {
      edges {
        post {
          postType
          ... on PostBoost {
            id
            channel {
              id
              channelType
              handle
              newsroom {
                contractAddress
                name
              }
              listing {
                name
                url
                charter {
                  uri
                }
              }
            }
            groupedSanitizedPayments {
              usdEquivalent
              payerChannel {
                handle
                tiny72AvatarDataUrl
              }
            }
            channelID
            currencyCode
            goalAmount
            paymentsTotal(currencyCode: "USD")
            title
            dateEnd
            why
          }
          ... on PostExternalLink {
            id
            publishedTime
            openGraphData {
              url
              title
              article {
                published_time
              }
              images {
                url
              }
            }
            channel {
              handle
              newsroom {
                name
              }
            }
            groupedSanitizedPayments {
              usdEquivalent
              payerChannel {
                handle
                tiny72AvatarDataUrl
              }
            }
            numChildren
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export const COMMENT_FRAGMENT = gql`
  fragment CommentFragment on PostComment {
    id
    authorID
    channelID
    text
    commentType
    channel {
      handle
      tiny72AvatarDataUrl
    }
    numChildren
  }
`;

export const POST_CHILDREN = gql`
  query PostChildren($id: String!, $first: Int, $after: String) {
    postsGetChildren(id: $id, first: $first, after: $after) {
      edges {
        post {
          ... on PostComment {
            ...CommentFragment
            children {
              edges {
                post {
                  ... on PostComment {
                    ...CommentFragment
                  }
                }
                cursor
              }
              pageInfo {
                endCursor
                hasNextPage
              }
            }
          }
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
  ${COMMENT_FRAGMENT}
`;

export const STORY_BOOST = gql`
  query StoryBoost($id: String!) {
    postsGet(id: $id) {
      ... on PostExternalLink {
        id
        createdAt
        openGraphData {
          url
          title
          article {
            published_time
          }
          images {
            url
          }
        }
        channel {
          isStripeConnected
          stripeAccountID
          handle
          newsroom {
            contractAddress
            multisigAddress
            name
            charter {
              newsroomUrl
              mission {
                purpose
              }
            }
          }
        }
        groupedSanitizedPayments {
          usdEquivalent
          payerChannel {
            handle
            tiny72AvatarDataUrl
          }
        }
        numChildren
        children {
          edges {
            post {
              ... on PostComment {
                ...CommentFragment
                children {
                  edges {
                    post {
                      ... on PostComment {
                        ...CommentFragment
                      }
                    }
                    cursor
                  }
                  pageInfo {
                    endCursor
                    hasNextPage
                  }
                }
              }
            }
            cursor
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
  ${COMMENT_FRAGMENT}
`;

export const POST_COMMENT_MUTATION = gql`
  mutation($input: PostCreateCommentInput!) {
    postsCreateComment(input: $input) {
      id
    }
  }
`;

export const COMMENT = gql`
  query StoryBoost($id: String!) {
    postsGet(id: $id) {
      ... on PostComment {
        ...CommentFragment
      }
    }
  }
  ${COMMENT_FRAGMENT}
`;
