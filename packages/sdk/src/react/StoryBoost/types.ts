export interface StoryBoostData {
  openGraphData: {
    title: string;
  };
  channel: {
    isStripeConnected: boolean;
    stripeAccountID: string;
    newsroom: {
      name: string;
      multisigAddress: string;
    };
  };
  groupedSanitizedPayments: StoryBoostPaymentsData[];
}

export interface StoryBoostPaymentsData {
  usdEquivalent: number;
  payerChannel: {
    handle: string;
    tiny72AvatarDataUrl: string;
  };
}
