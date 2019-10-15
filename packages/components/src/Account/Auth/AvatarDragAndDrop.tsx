import React from "react";
import { SimpleImageFileToDataUri } from "../../input";

export interface AvatarDragAndDropProps {
  onChange(dataUri: string): void;
}

export const AvatarDragAndDrop: React.FunctionComponent<AvatarDragAndDropProps> = ({ onChange }) => (
  <SimpleImageFileToDataUri onChange={onChange} />
);
