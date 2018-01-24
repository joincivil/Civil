import * as NewsroomArtifact from "./artifacts/Newsroom.json";
import * as RegistryWithAppellateArtifact from "./artifacts/RegistryWithAppellate.json";
import { Artifact } from "./types";

// TODO(ritave): Write a script that allows to add new smart-contract to the mix
//               It should take the .json file, add it to artifacts, regenerate this
//               file, and then regenerate CivilEventArgs (currently in types.ts)
export const artifacts = {
  Newsroom: NewsroomArtifact as any as Artifact,
  RegistryWithAppellate: RegistryWithAppellateArtifact as any as Artifact,
};
