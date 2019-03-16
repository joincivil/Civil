export class FeatureFlagService {
  public featureFlags: string[];
  constructor() {
    const urlParams = new URLSearchParams(window.location.search);
    this.featureFlags = urlParams.getAll("feature-flag");
  }
  public featureEnabled(feature: string): boolean {
    return this.featureFlags.includes(feature);
  }
}
