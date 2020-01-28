import * as React from "react";
import { Button, TextareaInput, buttonSizes } from "@joincivil/elements";
import {
  StoryDetailsComments, StoryComment,
} from "./StoryFeedStyledComponents";
import { Mutation, MutationFunc } from "react-apollo";
import gql from "graphql-tag";

export interface StoryCommentsProps {
  postId: string;
  comments: any;
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
          console.log("child.post: ", child.post);
          console.log("child.post.channel: ", child.post.channel);
          console.log("child.post.channel.tiny72AvatarDataUrl: ", child.post.channel.tiny72AvatarDataUrl);
          return (
            <StoryComment>
              Avatar: <img src={child.post.channel.tiny72AvatarDataUrl}/>
              Handle: {child.post.channel.handle}
              <p>Type: {child.post.commentType}</p>
              <p>Text: {child.post.text}</p>
            </StoryComment>
          );
        })}
      </StoryDetailsComments>
    </>
  );
};
