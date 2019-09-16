/** Selectively update react-create-app's react-scripts webpack config without ejecting the app. */

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

function addBoostEmbed(config, env) {
  const isEnvDevelopment = env === "development";

  let htmlWebpackPluginConfig;
  config.plugins.forEach(plugin => {
    if (!htmlWebpackPluginConfig && plugin.constructor.name === "HtmlWebpackPlugin" && plugin.options.filename === "index.html") {
      htmlWebpackPluginConfig = plugin.options;
    }
  });
  if (!htmlWebpackPluginConfig) {
    throw Error("Boost Embed: Failed to find main HtmlWebpackPlugin to use as base for new bundle/entry");
  }

  const boostEmbedHtml = "/home/toby/dev/civil/Civil/packages/dapp/public/boost-embed.html";
  const boostEmbedJs = "/home/toby/dev/civil/Civil/packages/dapp/src/boost-embed.tsx";

  return {
    ...config,
    entry: {
      main: config.entry,
      "boost-embed": isEnvDevelopment
        ? [
            config.entry[0], // hotloader
            boostEmbedJs
          ]
        : [ boostEmbedJs ],
    },
    output: {
      // @TODO/WIP/tobek This might be the part that's not working and causing both the main and boost bundles to be included in main entry point and for no bundles to be included in boost entry point. Doesn't work without modifying `output` though either.
      ...config.output,
      filename: "static/js/[name].js",
    },
    plugins: [
      ...config.plugins,
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: boostEmbedHtml,
            filename: "boost-embed.html",
            chunks: ["boost-embed"],
          },
          htmlWebpackPluginConfig,
        )
      ),
    ],
  }
}

function addResolve(config) {
  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        // When resolving styled-components even from external dependencies, look in monorepo node-modules before the dependency's own imported version. This is needed for @joincivil/civil-sdk, as per https://www.styled-components.com/docs/faqs#why-am-i-getting-a-warning-about-several-instances-of-module-on-the-page.
        // @TODO(tobek) this could maybe be resolved instead on the civil-sdk side by both a) moving styled-components into peerDependencies, and b) building civil-sdk with webpack and adding styled-components into `externals`, as per https://www.styled-components.com/docs/faqs#i-am-a-library-author-should-i-bundle-styledcomponents-with-my-library
        "styled-components": path.resolve("..", "..", "node_modules", "styled-components"),
      }
    }
  }
}

module.exports = function override(config, env) {
  const newConfig = addResolve(addBoostEmbed(config, env));
  console.log("overridden config:", newConfig);
  return newConfig;
}
