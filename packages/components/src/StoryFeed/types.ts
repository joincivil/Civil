export interface StoryNewsroomData {
  contractAddress: string;
  multisigAddress: string;
  charter: {
    name: string;
    newsroomUrl: string;
    mission: {
      purpose: string;
    };
    socialUrls?: {
      twitter?: string;
      facebook?: string;
      email?: string;
    };
  };
}

export interface OpenGraphData {
  description: string;
  images: OpenGraphImageData[];
  title: string;
  url: string;
}

export interface OpenGraphImageData {
  url: string;
}