import * as React from "react";
import {
  StoryComment,
  CivilCommentHeader,
  CivilCommentContent,
  CivilCommentAvatarContainer,
  CivilCommentAvatar,
  CivilCommentHeaderLeft,
  CivilCommentHeaderRight,
} from "./StoryFeedStyledComponents";

import { PostComments } from "./PostComments";

export interface CivilCommentProps {
  comment: any;
  level: number;
}

export const CivilComment: React.FunctionComponent<CivilCommentProps> = props => {
  const { commentType, text, channel, id, children, numChildren } = props.comment.post;
  const { tiny72AvatarDataUrl, handle } = channel;

  return (
    <StoryComment {...props}>
      <CivilCommentHeader>
        <CivilCommentHeaderLeft>
          <CivilCommentAvatarContainer>
            <CivilCommentAvatar src={tiny72AvatarDataUrl} />
          </CivilCommentAvatarContainer>
          {"@" + handle}
        </CivilCommentHeaderLeft>
        <CivilCommentHeaderRight>{commentType === "comment_announcement" && <>ANNOUNCEMENT</>}</CivilCommentHeaderRight>
      </CivilCommentHeader>
      <CivilCommentContent>
        <p>{text}</p>
      </CivilCommentContent>
      <PostComments
        postId={id}
        comments={children}
        numComments={numChildren}
        level={props.level + 1}
      />
    </StoryComment>
  );
};
