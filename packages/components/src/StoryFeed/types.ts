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
  article: {
    published_time: string;
  };
  description: string;
  images: {
    url: string;
  };
  title: string;
  url: string;
}
