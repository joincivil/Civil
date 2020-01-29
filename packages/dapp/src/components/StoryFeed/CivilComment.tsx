import * as React from "react";
import {
  StoryComment,
} from "./StoryFeedStyledComponents";

export interface CommentProps {
  comment: any;
}

export const CivilComment: React.FunctionComponent<CommentProps> = props => {
  const { commentType, text, channel } = props.comment.post;
  const { tiny72AvatarDataUrl, handle } = channel;
  return (
    <StoryComment>
      Avatar: <img src={tiny72AvatarDataUrl} />
      Handle: {handle}
      <p>Type: {commentType}</p>
      <p>Text: {text}</p>
    </StoryComment>
  );
};
