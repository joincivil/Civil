import * as NewsroomArtifact from "./artifacts/Newsroom.json";
import * as RegistryWithAppellateArtifact from "./artifacts/RegistryWithAppellate.json";
import { Artifact } from "./types";

export const artifacts = {
  Newsroom: NewsroomArtifact as any as Artifact,
  RegistryWithAppellate: RegistryWithAppellateArtifact as any as Artifact,
};
