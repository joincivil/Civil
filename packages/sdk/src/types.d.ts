declare module "apollo-storybook-react";
declare module "ipfs-http-client";
declare module "react-async-script";
declare module "iframe-resizer-react";

// So that when importing png image as URL it gets correctly typed as string:
declare module "*.png" {
  const value: string;
  export = value;
}
