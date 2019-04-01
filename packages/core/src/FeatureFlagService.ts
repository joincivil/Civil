export class FeatureFlagService {
  public featureFlags: string[];
  constructor(featureFlags?: string[]) {
    const urlParams = new URLSearchParams(window.location.search);
    this.featureFlags = (featureFlags || []).concat(urlParams.getAll("feature-flag"));
  }
  public featureEnabled(feature: string): boolean {
    return this.featureFlags.includes(feature);
  }
}
