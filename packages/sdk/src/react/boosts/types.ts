export interface BoostData {
  title: string;
  goalAmount: number;
  paymentsTotal: number;
  dateEnd: string;
  why: string;
  what: string;
  about: string;
  channelID: string;
  channel: {
    id: string;
    channelType: string;
    isStripeConnected: boolean;
    stripeAccountID: string;
    newsroom: {
      contractAddress: string;
    };
  };
  items: BoostCostItem[];
}

export interface BoostCostItem {
  item: string;
  cost?: number;
}

export interface BoostNewsroomData {
  name: string;
  url: string;
  owner: string;
  whitelisted: boolean;
  charter?: {
    uri: string;
  };
}
