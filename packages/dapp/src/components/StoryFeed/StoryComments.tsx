import * as React from "react";
import { Button, TextareaInput, buttonSizes } from "@joincivil/elements";
import { StoryDetailsComments, StoryComment } from "./StoryFeedStyledComponents";
import { Mutation, MutationFunc, Query } from "react-apollo";
import gql from "graphql-tag";
import { CivilComment } from "./CivilComment";
import { MoreComments } from "./MoreComments";
import { POST_COMMENT_MUTATION, COMMENT } from "./queries";
import { LoadingMessage } from "@joincivil/components";

export interface StoryCommentsProps {
  postId: string;
  comments: any;
  numComments: number;
}

export const StoryComments: React.FunctionComponent<StoryCommentsProps> = props => {
  const [commentText, setCommentText] = React.useState("");
  const [myNewCommentIDs, setMyNewCommentIDs] = React.useState([]);

  console.log("StoryComments comments: ", props.comments);
  const edgesLength = props.comments.edges.length;
  // console.log("edges length: ", edgesLength);
  const remainingChildren = props.numComments - edgesLength;
  console.log("remainingChildren: ", remainingChildren);
  const endCursor = props.comments.pageInfo.endCursor;
  console.log("endCursor: ", endCursor);
  return (
    <>
      <StoryDetailsComments>
        <Mutation mutation={POST_COMMENT_MUTATION}>
          {(postCommentMutation: MutationFunc) => {
            return (
              <>
                <TextareaInput
                  name="post_comment_input"
                  value={commentText}
                  onChange={(name: any, value: string) => {
                    setCommentText(value);
                  }}
                  maxLength={"500"}
                />
                <Button
                  size={buttonSizes.SMALL}
                  onClick={async () => {
                    const res = await postCommentMutation({
                      variables: {
                        input: {
                          parentID: props.postId,
                          commentType: "comment_default",
                          text: commentText,
                        },
                      },
                    });
                    setMyNewCommentIDs(myNewCommentIDs.concat(res.data.postsCreateComment.id));
                  }}
                >
                  Comment
                </Button>
                <Button
                  size={buttonSizes.SMALL}
                  onClick={async () => {
                    const res = await postCommentMutation({
                      variables: {
                        input: {
                          parentID: props.postId,
                          commentType: "comment_announcement",
                          text: commentText,
                        },
                      },
                    });
                    setMyNewCommentIDs(myNewCommentIDs.concat(res.data.postsCreateComment.id));
                  }}
                >
                  Announcement
                </Button>
              </>
            );
          }}
        </Mutation>
        {myNewCommentIDs.map(postID => {
          return (
            <Query query={COMMENT} variables={{ id: postID }}>
              {({ loading, error, data }) => {
                if (loading) {
                  return <LoadingMessage>Loading Comment</LoadingMessage>;
                } else if (error || !data || !data.postsGet) {
                  console.error("error loading comment data. error:", error, "data:", data);
                  return "Error loading comment.";
                }
                const comment = { post: data.postsGet };
                return <CivilComment comment={comment} level={0} />;
              }}
            </Query>
          );
        })}
        {props.comments.edges.map(child => {
          return <CivilComment comment={child} level={0} />;
        })}
        <MoreComments
          postId={props.postId}
          prevEndCursor={props.comments.pageInfo.endCursor}
          numMoreComments={remainingChildren}
          level={0}
        />
      </StoryDetailsComments>
    </>
  );
};
