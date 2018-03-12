# @joincivil/multisig

A fork of [Gnosis multisig wallet](https://github.com/gnosis/MultiSigWallet). Kept in a seperate repo to honour the license terms of GPLv3.0 of the original project.

The goal of this package is to provide a Board Of Directors contract that acts an abstracted singular Will of a Newsroom.

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

## Contributing

Civil's ecosystem is free and open-source, we're all part of it and you're encouraged to be a part of it with us.
Best place to start hacking would be to use the [`@joincivil/core`](/packages/core) and build some application on top of the protocol.

If you're itching to dwelve deeper inside, [**help wanted**](https://github.com/joincivil/Civil/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)
and [**good first issue**](https://github.com/joincivil/Civil/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) labels are good places to get started and learn the architecture.
