# @joincivil/contracts

Smart-contracts that build the kernel of the protocol and ecosystem of Civil in general. To be deployed on Ethereum's network

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
Best place to start hacking would be to use the [`@joincivil/core`][/packages/core] and build some application on top of the protocol.

If you're itching to dwelve deeper inside, [**help wanted**](https://github.com/joincivil/Civil/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)
and [**good first issue**](https://github.com/joincivil/Civil/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) labels are good places to get started and learn the architecture.
