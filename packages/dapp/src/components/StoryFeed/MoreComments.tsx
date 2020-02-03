import * as React from "react";
import { Query } from "react-apollo";
import { LoadingMessage, buttonSizes, Button, colors } from "@joincivil/components";
import { POST_CHILDREN } from "./queries";
import { CivilComment } from "./CivilComment";
import styled from "styled-components";

export interface MoreCommentsProps {
  postId: string;
  numMoreComments: number;
  level: number;
  prevEndCursor: string;
}

const TopLevelLoadMoreSpan = styled.span`
  color: ${colors.accent.CIVIL_BLUE_FADED};
  font-size: 12;
  margin-left: 0;
`;

const ReplyLoadMoreSpan = styled.span`
  color: ${colors.accent.CIVIL_BLUE_FADED};
  font-size: 8;
  margin-left: 0;
`;

export const MoreComments: React.FunctionComponent<MoreCommentsProps> = props => {
  const id = props.postId;

  const [firstLoad, setFirstLoad] = React.useState(false);

  if (props.numMoreComments <= 0) {
    return <></>;
  }

  const LoadMoreSpan = props.level === 0 ? TopLevelLoadMoreSpan : ReplyLoadMoreSpan;
  const loadMoreText = props.level === 0 ? "Load More Comments" : "Load More Replies";

  if (!firstLoad) {
    return (
      <LoadMoreSpan onClick={() => setFirstLoad(true)}>
        {loadMoreText}
      </LoadMoreSpan>
    );
  } else {
    return (
      <Query query={POST_CHILDREN} variables={{ id, first: 3, after: props.prevEndCursor }}>
        {({ loading, error, data, fetchMore }) => {
          if (loading) {
            return <LoadingMessage>Loading Comments</LoadingMessage>;
          } else if (error || !data || !data.postsGetChildren) {
            console.error("error loading children data. error:", error, "data:", data);
            return "Error loading children.";
          }

          const comments = data.postsGetChildren;

          const commentList = comments.edges.map(child => {
            return <CivilComment comment={child} level={props.level} />;
          });
          return (
            <>
              {commentList}
              {comments.pageInfo.hasNextPage && (
                <LoadMoreSpan
                  onClick={() =>
                    fetchMore({
                      query: POST_CHILDREN,
                      variables: {
                        id,
                        first: 3,
                        after: comments.pageInfo.endCursor,
                      },
                      updateQuery: (previousResult: any, { fetchMoreResult }: any) => {
                        const newEdges = fetchMoreResult.postsGetChildren.edges;
                        const pageInfo = fetchMoreResult.postsGetChildren.pageInfo;

                        return newEdges.length
                          ? {
                            postsGetChildren: {
                              edges: [...previousResult.postsGetChildren.edges, ...newEdges],
                                pageInfo,
                                __typename: previousResult.postsGetChildren.__typename,
                              },
                            }
                          : previousResult;
                      },
                    })
                  }
                >
                  {loadMoreText}
                </LoadMoreSpan>
              )}
            </>
          );
        }}
      </Query>
    );
  }
};
