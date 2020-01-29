import * as React from "react";
import {
  StoryComment, CivilCommentHeader, CivilCommentContent, CivilCommentAvatarContainer, CivilCommentAvatar, CivilCommentHeaderLeft, CivilCommentHeaderRight, CivilCommentFooter,
} from "./StoryFeedStyledComponents";
import { Mutation, MutationFunc, Query } from "react-apollo";
import { POST_COMMENT_MUTATION, COMMENT } from "./queries";
import { TextareaInput, Button, buttonSizes } from "@joincivil/elements";
import { MoreComments } from "./MoreComments";
import { LoadingMessage } from "@joincivil/components";

export interface CivilCommentProps {
  comment: any;
  level: number;
}

export const CivilComment: React.FunctionComponent<CivilCommentProps> = props => {
  const { commentType, text, channel, id, comments, numChildren } = props.comment.post;
  const { tiny72AvatarDataUrl, handle } = channel;

  const [showReplyForm, setShowReplyForm] = React.useState(false);
  const [commentText, setCommentText] = React.useState("");
  const [myNewCommentIDs, setMyNewCommentIDs] = React.useState([]);

  const numChildrenRemaining = numChildren - (comments ? comments.edges.length : 0);

  return (
    <StoryComment {...props}>
      <CivilCommentHeader>
        <CivilCommentHeaderLeft>
          <CivilCommentAvatarContainer>
            <CivilCommentAvatar src={tiny72AvatarDataUrl} />
          </CivilCommentAvatarContainer>
          {"@" + handle}
        </CivilCommentHeaderLeft>
        <CivilCommentHeaderRight>
          {commentType === "comment_announcement" &&(<>ANNOUNCEMENT</>)}
        </CivilCommentHeaderRight>
      </CivilCommentHeader>
      <CivilCommentContent>
        <p>{text}</p>
      </CivilCommentContent>
      <CivilCommentFooter>
        <span onClick={() => setShowReplyForm(!showReplyForm)}>Reply</span>
      </CivilCommentFooter>
      {showReplyForm && (<>
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
                          parentID: id,
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
              </>
            );
          }}
        </Mutation>
      </>)}
      {myNewCommentIDs.map(postID => {
        return (<Query query={COMMENT} variables={{id: postID}}>
          {({ loading, error, data }) => {
            if (loading) {
              return <LoadingMessage>Loading Comment</LoadingMessage>;
            } else if (error || !data || !data.postsGet) {
              console.error("error loading comment data. error:", error, "data:", data);
              return "Error loading comment.";
            }
            const comment = { post: data.postsGet }
            return <CivilComment comment={comment} level={props.level + 1} />
          }}
        </Query>)
      })}
      {comments && comments.edges.map(child => {
        return (
          <CivilComment comment={child} level={props.level + 1}/>
        );
      })}
      <MoreComments postId={id} prevEndCursor={comments ? comments.pageInfo.endCursor : ""} numMoreComments={numChildrenRemaining} level={props.level + 1}/>
    </StoryComment>
  );
};
