/** Selectively update react-create-app's react-scripts webpack config without ejecting the app. */

const path = require("path");

module.exports = function override(config, env) {
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
