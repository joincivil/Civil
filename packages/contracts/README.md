# @joincivil/contracts

Smart-contracts that build the kernel of the protocol and ecosystem of Civil in general. To be deployed on Ethereum's network.

## Note

In order to generate documentation of Smart-contracts, we use a version of `doxity` forked from `0x`. Unfortunately, this tool is buggy and fails on contracts that try to import from folders outside the contrats folder. Thus, rather than being able to simply install Open Zeppelin contracts via NPM, and install EthPM packages via `truffle install`, we have copied the needed contracts into our repo (relevant folders are `zeppelin-solidity` and `installed_contracts`). Contracts within these folders are not checked for code coverage, as they are widely used across the Ethereum ecosystem already.

## Usage

Start up [Ganache](https://github.com/trufflesuite/ganache-cli) in the root directory of the monorepo:

```bash
yarn ganache
```

Build and strip the artifacts:

```bash
yarn build
```

Run tests:

```bash
yarn test
```

And check out migrations:

```bash
yarn truffle migrate
```

## Artifacts

Truffle generates a lot of additional data inside the .json artifacts that are needed to interface with the artifacts from outside
the Ethereum's network.

During the build process artifacts are striped out of additional, debugging information and placed in the `build/artifacts` folder.

## Contributing

Civil's ecosystem is free and open-source, we're all part of it and you're encouraged to be a part of it with us.
Best place to start hacking would be to use the [`@joincivil/core`](/packages/core) and build some application on top of the protocol.

If you're itching to dwelve deeper inside, [**help wanted**](https://github.com/joincivil/Civil/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)
and [**good first issue**](https://github.com/joincivil/Civil/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) labels are good places to get started and learn the architecture.

## Licenses

Inside this package there are multiple smart-contracts from multiple open-sources with somewhat different licensing terms.
While we're working to get everything under LGPLv2.1 this is not currently possible.
[`contracts`](./contracts) and [`test`](./test) folders are split into subfolders with specific names, code under those subfolders is licensed under licenses as follow:

| Subfolder       | License                                                                                              | Original source                                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `tcr/`          | [![license](https://img.shields.io/badge/license-Apache%20v2.0-green.svg)](./licenses/LICENSE-tcr)   | [skmgoldin/tcr](https://github.com/skmgoldin/tcr)                                                                 |
| `multisig/`     | [![license](https://img.shields.io/badge/license-LGPL%20v2.1-green.svg)](./licenses/LICENSE-general) | [gnosis/MultiSigWallet](https://github.com/gnosis/MultiSigWallet/commit/ac93a926aac155fb50590130edaa0b26b3487ba4) |
| `anything else` | [![license](https://img.shields.io/badge/license-LGPL%20v2.1-green.svg)](./licenses/LICENSE-general) | [civil/Civil](https://github.com/joincivil/Civil)                                                                 |
