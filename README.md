![Civil Logo](doc/civil_logo_white.png?raw=true)

---

[Civil](https://joincivil.com/) is a decentralized and censorship resistant ecosystem for online Journalism. Read more in our whitepaper.

This repository contains all of the open-source Civil tools and packages written in Typescript.
We hope that those tools will be useful for creation of interesting applications on top of the ecosystem as well as be useful in any project in the Ethereum space.

[![CircleCI](https://img.shields.io/circleci/project/github/joincivil/Civil.svg)](https://circleci.com/gh/joincivil/Civil/tree/master)
[![Telegram chat](https://img.shields.io/badge/chat-telegram-blue.svg)](https://t.me/join_civil)

### Published packages

| Package                                                         | NPM                                                                                                                                      | Description                                                            |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [`@joincivil/core`][core-url]                                   | [![npm link](https://img.shields.io/badge/npm-core-blue.svg)](https://www.npmjs.com/package/@joincivil/core)                             | JS library for interacting with Civil ecosystem                        |
| [`@joincivil/tslint-rules`](/packages/tslint-rules)             | [![npm link](https://img.shields.io/badge/npm-tslint--rules-blue.svg)](https://www.npmjs.com/package/@joincivil/tslint-rules)            | Linting rules for Civil's Typescript packages                          |
| [`@joincivil/utils`](/packages/utils)                           | [![npm link](https://img.shields.io/badge/npm-utils-blue.svg)](https://www.npmjs.com/package/@joincivil/utils)                           | Utilities shared between Civil projects used during runtime            |
| [`@joincivil/editor`](/packages/editor)                         | [![npm link](https://img.shields.io/badge/npm-editor-blue.svg)](https://www.npmjs.com/package/@joincivil/editor)                         | Editor for Civil-formatted articles and content                        |
| [`@joincivil/typescript-types`](/packages/typescript-types)     | [![npm link](https://img.shields.io/badge/npm-typescript-types-blue.svg)](https://www.npmjs.com/package/@joincivil/typescript-types)     | Types used in multiple Civil packages                                  |
| [`@joincivil/typescript-typings`](/packages/typescript-typings) | [![npm link](https://img.shields.io/badge/npm-typescript-typings-blue.svg)](https://www.npmjs.com/package/@joincivil/typescript-typings) | Typescript type roots for external projects and internal modifications |

### Private packages

| Package                                       | Description                                                                                                         |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [`@joincivil/contracts`](/packages/contracts) | Smart-contracts needed for the Civil's protocol                                                                     |
| [`@joincivil/dapp`](/packages/dapp)           | DApp for interacting with the Civil contracts                                                                       |
| [`@joincivil/dev-utils`](/packages/dev-utils) | Utilities needed for the proper working of the mono-repo packages, builds and tests                                 |
| [`@joincivil/debug-ui`](/packages/debug-ui)   | WIP: Minimal website to monitor, observe and debug the protocol and all the utilities and packages of the ecosystem |

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

some of the packages - most notably [`@joincivil/core`][core-url] depend on already deployed singletons. Our ganache is set-up to be deterministic and thus when you migrate contracts locally, singletons will have the same addresses as the artifacts.

```bash
cd packages/contracts
yarn migrate --network=ganache
```

Finally run all the tests in the main repository:

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
