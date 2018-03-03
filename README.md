![Civil Logo](doc/civil_logo_white.png?raw=true)

---

[Civil](https://joincivil.com/) is a decentralized and censorship resistant ecosystem for online Journalism. Read more in our whitepaper.

This repository contains all of the open-source Civil tools and packages written in Typescript.
We hope that those tools will be useful for creation of interesting applications on top of the ecosystem as well as be useful in any project in the Ethereum space.

[![CircleCI](https://img.shields.io/circleci/project/github/joincivil/Civil.svg)](https://circleci.com/gh/joincivil/Civil)
[![Slack chat](https://img.shields.io/badge/chat-slack-e6186d.svg)](https://civil-slack-signup.herokuapp.com/)

### Published packages

| Package                                             | Badges                                                                                                                                                                                                                                       | Description                                                 |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| [`@joincivil/core`][core-url]                       | [![npm (scoped)](https://img.shields.io/npm/v/@joincivil/core.svg)](https://www.npmjs.com/package/@joincivil/core)[![license](https://img.shields.io/badge/license-LGPL%20v2.1-green.svg)](/packages/core/LICENSE)                           | JS library for interacting with Civil ecosystem             |
| [`@joincivil/tslint-rules`](/packages/tslint-rules) | [![npm (scoped)](https://img.shields.io/npm/v/@joincivil/tslint-rules.svg)](https://www.npmjs.com/package/@joincivil/tslint-rules)[![license](https://img.shields.io/badge/license-Apache%20v2.0-green.svg)](/packages/tslint-rules/LICENSE) | Linting rules for Civil's Typescript packages               |
| [`@joincivil/utils`](/packages/utils)               | [![npm (scoped)](https://img.shields.io/npm/v/@joincivil/utils.svg)](https://www.npmjs.com/package/@joincivil/utils)[![license](https://img.shields.io/badge/license-Apache%20v2.0-green.svg)](/packages/utils/LICENSE)                      | Utilities shared between Civil projects used during runtime |

### Private packages

| Package                                       | License                                                                                                 | Description                                                                                                         |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [`@joincivil/contracts`](/packages/contracts) | [![license](https://img.shields.io/badge/license-LGPL%20v2.1-green.svg)](/packages/contracts/LICENSE)   | Smart-contracts needed for the Civil's protocol                                                                     |
| [`@joincivil/dev-utils`](/packages/dev-utils) | [![license](https://img.shields.io/badge/license-Apache%20v2.0-green.svg)](/packages/dev-utils/LICENSE) | Utilities needed for the proper working of the mono-repo packages, builds and tests                                 |
| [`@joincivil/debug-ui`](/packages/debug-ui)   | [![license](https://img.shields.io/badge/license-Apache%20v2.0-green.svg)](/packages/debug-ui/LICENSE)  | WIP: Minimal website to monitor, observe and debug the protocol and all the utilities and packages of the ecosystem |

## Contributing

Civil's ecosystem is free and open-source, we're all part of it and you're encouraged to be a part of it with us.
Best place to start hacking would be to use the [`@joincivil/core`][core-url] and build some application on top of the protocol.

If you're itching to dwelve deeper inside, [**help wanted**](https://github.com/joincivil/Civil/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)
and [**good first issue**](https://github.com/joincivil/Civil/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) labels are good places to get started and learn the architecture.

### Install dependencies

This project is using [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/). They require `yarn >= 1.0` to work properly.

Set up all dependencies:

```bash
yarn install
```

### Build

Build all packages in the monorepo:

```bash
yarn build
```

Turn on file-watch mode and rebuild most of the files on change:

```bash
yarn watch
```

### Lint

Check all packages for linting errors:

```bash
yarn lint
```

### Testing

Tests in Civil's ecosystem require the use of [Ganache](https://github.com/trufflesuite/ganache-cli), Ethereum's development test network, spin it in a seperate terminal:

```bash
yarn ganache
```

and then run all the tests:

```bash
yarn test
```

### Run commands in all packages

Civil's monorepo is using [lerna](https://github.com/lerna/lerna) to easily manage the monorepo structure. Two helper yarn scripts are provided for your convenience.

To run the supported lerna version:

```bash
yarn lerna
```

To run scripts in all packages in the monorepo:

```bash
yarn lerna:run
```

### Cleaning the state

To refresh the repository state as much as possible run:

```bash
yarn clean && yarn lerna clean --yes && rm -r node_modules && yarn install
```




🐙 was here.

[core-url]: /packages/core
