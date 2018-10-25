import { LedgerSubprovider, LedgerSubproviderConfigs } from "@0xproject/subproviders";

export interface FilteredConfigs extends LedgerSubproviderConfigs {
  accountId?: number;
}

export class FilteredLedgerProvider extends LedgerSubprovider {
  private accountId: number;
  constructor(config: FilteredConfigs) {
    super(config);
    this.accountId = config.accountId || 0;
  }

  public async getAccountsAsync(): Promise<string[]> {
    const accounts = await super.getAccountsAsync(this.accountId + 1);
    return [accounts[this.accountId]];
  }
}
