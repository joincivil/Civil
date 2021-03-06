export interface StoryBoostData {
  createdAt: string;
  openGraphData: OpenGraphData;
  channel: {
    isStripeConnected: boolean;
    stripeAccountID: string;
    newsroom: StoryNewsroomData;
    listing: {
      challenge: {
        challengeID: string;
      };
    };
  };
  groupedSanitizedPayments: StoryBoostPaymentsData[];
  children: any;
  numChildren: number;
}

export interface StoryBoostPaymentsData {
  usdEquivalent: number;
  payerChannel: {
    handle: string;
    tiny72AvatarDataUrl: string;
  };
}

export interface StoryNewsroomData {
  contractAddress: string;
  multisigAddress: string;
  name: string;
  charter: {
    newsroomUrl: string;
    mission: {
      purpose: string;
    };
  };
  handle: string;
}

export interface OpenGraphData {
  article: {
    published_time: string;
  };
  description: string;
  images: OpenGraphImageData[];
  title: string;
  url: string;
}

export interface OpenGraphImageData {
  url: string;
}
