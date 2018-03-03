# @joincivil/core

This library is the main-entry point for any developer wanting to work with the Civil ecosystem. It abstracts communication with the Ethereum blockchain as well as storing and loading articles from file storage servers.

## Installation

```bash
yarn add @joincivil/core
```

## Usage

```typescript
import { Civil } from "@joincivil/core"

const MY_NEWSROOM_ADDRESS = "0xABC...";

(async () => {
  const civil = new Civil();
  const newsroom = civil.newsroomAtUntruested(MY_NEWSROOM_ADDRESS);
  const article = await newsroom.loadArticle(0);
  console.log("First article");
  console.log("Author:", article.author);
  console.log("Content:");
  console.log(article.content);
}).catch(console.error);
```

Check the [documentation directory](./doc) for more

## Contributing

Civil's ecosystem is free and open-source, we're all part of it and you're encouraged to be a part of it with us.
Best place to start hacking would be to use this package and build some application on top of the protocol.

If you're itching to dwelve deeper inside, [**help wanted**](https://github.com/joincivil/Civil/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)
and [**good first issue**](https://github.com/joincivil/Civil/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) labels are good places to get started and learn the architecture.

### Code generation

Civil.ts uses auto-generated code from Smart-Contract .json artifacts.
Run `yarn build` or explicitly `yarn generate` to create them in the [`src/contracts/generated/`](./src/contracts/generated/) directory, afterwards develop as normal.

#### Adding new smart-contracts

- [ ] Add new .json definition to [`src/artifacts`](./src/artifacts/)
- [ ] Run `yarn generate`
- [ ] Enjoy automated generated code

The templates for code generation can be found [`src/templates/`](./src/templates).
