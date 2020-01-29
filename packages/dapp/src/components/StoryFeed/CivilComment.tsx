import * as React from "react";
import {
  StoryComment, CivilCommentHeader, CivilCommentContent, CivilCommentAvatarContainer, CivilCommentAvatar, CivilCommentHeaderLeft, CivilCommentHeaderRight,
} from "./StoryFeedStyledComponents";

export interface CommentProps {
  comment: any;
}

export const CivilComment: React.FunctionComponent<CommentProps> = props => {
  const { commentType, text, channel } = props.comment.post;
  const { tiny72AvatarDataUrl, handle } = channel;
  return (
    <StoryComment>
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
    </StoryComment>
  );
};
