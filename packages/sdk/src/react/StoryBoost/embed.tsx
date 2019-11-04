import * as React from "react";
import * as ReactDOM from "react-dom";
import gql from "graphql-tag";
import { ApolloProvider, Mutation } from "react-apollo";
import { getApolloClient } from "@joincivil/utils";

const EXTERNAL_LINK_MUTATION = gql`
  mutation($input: PostCreateExternalLinkInput!) {
    postsCreateExternalLinkEmbedded(input: $input) {
      id
      url
      channelID
    }
  }
`;

const channelID = "a0e47861-2bc2-416e-9313-9a851fe2b6b8";
const url = "http://en.wikipedia.org/wiki/Timeline_of_the_far_future";
const dappOrigin = "http://localhost:3000"; // @TODO/tobek Get from environment
let isEmbedCreated = false;

const apolloClient = getApolloClient();

function createEmbed(boostId: string): void {
  if (isEmbedCreated) {
    return;
  }
  isEmbedCreated = true;

  let selfScript = document.currentScript;
  if (!selfScript) {
    // @TODO/tobek `document.currentScript` should work but doesn't seem to be working when served from webpack. Need to confirm it works in production and if it doesn't then we should use this method which should be updated with the correct `src`
    selfScript = document.querySelector('script[src="/static/js/boost.js"]');
  }
  if (!selfScript) {
    console.error("Could not get current script");
    return;
  }

  const iframe = document.createElement("iframe");
  iframe.src = `${dappOrigin}/embed/boost/story/${boostId}`;

  selfScript.parentNode!.insertBefore(iframe, selfScript);
}

function init(): void {
  ReactDOM.render(
    // @ts-ignore: bugs with apollo types e.g. https://github.com/awslabs/aws-mobile-appsync-sdk-js/issues/166
    <ApolloProvider client={apolloClient}>
      <Mutation<any> mutation={EXTERNAL_LINK_MUTATION} variables={{ input: { url, channelID } }}>
        {(mutation, { loading, data, error, called }) => {
          if (!called && !error) {
            console.warn("@TODO posting URL...");
            window.setImmediate(() => mutation().catch(() => {}));
            return <>Loading...</>;
          }
          if (loading) {
            return <>Loading...</>;
          }
          if (error || !data || !data.postsCreateExternalLinkEmbedded) {
            console.error("Error posting URL", error, data);
            return (
              <>
                {/*@TODO/tobek Update error UI*/}
                <div>Error posting URL: {error ? error.message || error.toString() : "no data returned"}</div>
                <a href="#" onClick={() => createEmbed("2ecb4ec2-f063-48df-810f-8d814cd0712f")}>
                  create test embed
                </a>
              </>
            );
          }

          // @TODO/tobek tmp put actual ID in
          createEmbed("2ecb4ec2-f063-48df-810f-8d814cd0712f");
          return (
            <>
              <h1>HELLO</h1>
              <pre>{JSON.stringify(data.postsCreateExternalLinkEmbedded, null, 2)}</pre>
            </>
          );
        }}
      </Mutation>
    </ApolloProvider>,
    document.getElementById("civil-boost"),
  );
}

if (document.readyState === "complete") {
  init();
} else {
  window.addEventListener("load", init);
}
