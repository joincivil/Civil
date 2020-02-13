import { getAllUrlSearchParam } from "@joincivil/utils";

export class FeatureFlagService {
  public featureFlags: string[];
  constructor(featureFlags?: string[]) {
    this.featureFlags = (featureFlags || []).concat(getAllUrlSearchParam("feature-flag"));
  }
  public featureEnabled(feature: string): boolean {
    return this.featureFlags.includes(feature);
  }
}
