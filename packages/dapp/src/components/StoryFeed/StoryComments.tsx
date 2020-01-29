import * as React from "react";
import { Button, TextareaInput, buttonSizes } from "@joincivil/elements";
import {
  StoryDetailsComments, StoryComment,
} from "./StoryFeedStyledComponents";
import { Mutation, MutationFunc } from "react-apollo";
import gql from "graphql-tag";
import { CivilComment } from "./CivilComment";
import { MoreComments } from "./MoreComments";

export interface StoryCommentsProps {
  postId: string;
  comments: any;
  numComments: number;
  refetch: any;
}

const POST_COMMENT_MUTATION = gql`
  mutation($input: PostCreateCommentInput!) {
    postsCreateComment(input: $input) {
      id
    }
  }
`;

export const StoryComments: React.FunctionComponent<StoryCommentsProps> = props => {
  const [commentText, setCommentText] = React.useState("");

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
                    await postCommentMutation({
                      variables: {
                        input: {
                          parentID: props.postId,
                          commentType: "comment_default",
                          text: commentText,
                        },
                      },
                    });
                    props.refetch();
                  }}
                >
                  Comment
                </Button>
                <Button
                  size={buttonSizes.SMALL}
                  onClick={async () => {
                    await postCommentMutation({
                      variables: {
                        input: {
                          parentID: props.postId,
                          commentType: "comment_announcement",
                          text: commentText,
                        },
                      },
                    });
                    props.refetch();
                  }}
                >
                  Announcement
                </Button>
              </>
            );
          }}
        </Mutation>
        {props.comments.edges.map(child => {
          return (
            <CivilComment comment={child} />
          );
        })}
        <MoreComments postId={props.postId} prevEndCursor={props.comments.pageInfo.endCursor} numMoreComments={remainingChildren}/>
      </StoryDetailsComments>
    </>
  );
};
