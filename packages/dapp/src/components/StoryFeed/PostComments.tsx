import * as React from "react";
import { Button, TextareaInput, buttonSizes, colors } from "@joincivil/elements";
import { StoryDetailsComments, StoryComment } from "./StoryFeedStyledComponents";
import { Mutation, MutationFunc, Query } from "react-apollo";
import gql from "graphql-tag";
import { CivilComment } from "./CivilComment";
import { MoreComments } from "./MoreComments";
import { POST_COMMENT_MUTATION, COMMENT } from "./queries";
import { LoadingMessage } from "@joincivil/components";
import styled from "styled-components";

export interface PostCommentsProps {
  postId: string;
  comments: any;
  numComments: number;
  level: number;
}

const TopLevelReplySpan = styled.span`
  color: ${colors.accent.CIVIL_BLUE_FADED};
  font-size: 12;
  margin-left: 0;
`;

const ReplySpan = styled.span`
  color: ${colors.accent.CIVIL_BLUE_FADED};
  font-size: 8;
  margin-left: 0;
`;

export const PostComments: React.FunctionComponent<PostCommentsProps> = props => {
  const [commentText, setCommentText] = React.useState("");
  const [myNewCommentIDs, setMyNewCommentIDs] = React.useState([]);
  const [showReply, setShowReply] = React.useState(props.level === 0);

  const edgesLength = (props.comments && props.comments.edges) ? props.comments.edges.length : 0;
  const remainingChildren = props.numComments - edgesLength;
  const endCursor = (props.comments && props.comments.pageInfo) ? props.comments.pageInfo.endCursor : "";
  return (
    <>
      <StoryDetailsComments>
        {showReply && (
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
                  {props.level === 0 && (
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
                  )}
                </>
              );
            }}
          </Mutation>
        )}
        {showReply && props.level === 0 && (
          <TopLevelReplySpan onClick={() => setShowReply(false)}>Hide Comment Form</TopLevelReplySpan>
        )}
        {showReply && props.level !== 0 && (
          <ReplySpan onClick={() => setShowReply(false)}>Hide Reply Form</ReplySpan>
        )}
        {!showReply &&  props.level === 0 && (
          <TopLevelReplySpan onClick={() => setShowReply(true)}>Leave a Comment</TopLevelReplySpan>
        )}
        {!showReply && props.level !== 0 && (
          <ReplySpan onClick={() => setShowReply(true)}>Reply</ReplySpan>
        )}
        <br />
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
                return <CivilComment comment={comment} level={props.level} />;
              }}
            </Query>
          );
        })}
        {props.comments && props.comments.edges && props.comments.edges.map(child => {
          return <CivilComment comment={child} level={props.level} />;
        })}
        <MoreComments
          postId={props.postId}
          prevEndCursor={endCursor}
          numMoreComments={remainingChildren}
          level={props.level}
        />
      </StoryDetailsComments>
    </>
  );
};
