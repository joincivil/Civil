# @joincivil/core

This library is the main-entry point for any developer wanting to work with the Civil ecosystem. It abstracts communication with the Ethereum blockchain as well as storing and loading articles from file storage servers.

[![license](https://img.shields.io/badge/license-LGPL%20v2.1-green.svg)](./LICENSE)

## Installation

```bash
yarn add @joincivil/core
```

## Usage

```typescript
import { Civil } from "@joincivil/core";

const MY_NEWSROOM_NAME = "Example Newsroom";
const MY_CONTENT_URI = "https://example.com/article/123";
const MY_CONTENT_HASH = "0x123abc";

(async () => {
  const civil = new Civil();

  // This will launch web3 wallet, e.g. MetaMask, to confirm transaction:
  const newsroomTx = await civil.newsroomDeployTrusted(MY_NEWSROOM_NAME);
  console.log("Waiting for newsroom creation tx", newsroomTx.txHash, "to complete...");

  const newsroom = await newsroomTx.awaitReceipt();
  console.log("Newsroom created with name", await newsroom.getName(), "at address", newsroom.address);

  const pendingTx = await newsroom.publishURIAndHash(MY_CONTENT_URI, MY_CONTENT_HASH);
  console.log("Waiting for publish tx", pendingTx.txHash, "to complete...");

  const contentId = await pendingTx.awaitReceipt();
  console.log("Content published with ID", contentId);
  console.log("Content:", await newsroom.loadArticle(contentId));
})().catch(console.error);
```

Check the [documentation directory](./doc) for more

## Contributing

Civil's ecosystem is free and open-source, we're all part of it and you're encouraged to be a part of it with us.
Best place to start hacking would be to use this package and build some application on top of the protocol.

If you're itching to dwelve deeper inside, [**help wanted**](https://github.com/joincivil/Civil/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)
and [**good first issue**](https://github.com/joincivil/Civil/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) labels are good places to get started and learn the architecture.

### Developing on ganache

This package has artifacts with singleton addresses of smart-contracts deployed on multiple Ethereum networks, one of which is our Ganache instance, that is set-up to be completely predictable.
This means that whenever we run migrations on [`@joincivil/contracts`](../contracts) in Ganache, the addresses are gonna be the same as the ones included in this packages.

Migrations are run automatically when `yarn ganache` in the root of monorepo is called.

### Code generation

Civil.ts uses auto-generated code from Smart-Contract .json artifacts.
Run `yarn build` or explicitly `yarn generate` to create them in the `src/contracts/generated/` directory, afterwards develop as normal.

#### Adding new smart-contracts

- [ ] Write new or change some smart-contracts in [`@joincivil/contracts`](../contracts)
- [ ] Add migration files and build.
- [ ] Run `yarn ganache` in the root to make migrations
- [ ] `cp ../contracts/build/artifacts/MyContract.json ./src/artifacts/` (merge manually if deployed on Rinkeby or Mainnet)
- [ ] Run `yarn generate`
- [ ] Enjoy automatically generated code

The templates for code generation can be found [`src/templates/`](./src/templates).
