# @joincivil/tslint-rules

Shared rules for Typescript linter

## Installation

Your tslint needs to be `>=5.9` for the yaml support

```bash
yarn add --dev @joincivil/tslint-rules
```

## Usage

Install tslint:

```bash
yarn add --dev tslint
```

In your `tslint.json` or `tslint.yaml` extend the rules:

```yaml
---
extends: "@joincivil/tslint-rules"
rules:
  # Your additional / overridinng rules here
  max-line-length:
    options: [7272]
```

Run linter with the `--project` option for all the rules to work:

```bash
tslint --project ./
```

## Contributing

Civil's ecosystem is free and open-source, we're all part of it and you're encouraged to be a part of it with us.
Best place to start hacking would be to use the [`@joincivil/core`](/packages/core) and build some application on top of the protocol.

If you're itching to dwelve deeper inside, [**help wanted**](https://github.com/joincivil/Civil/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)
and [**good first issue**](https://github.com/joincivil/Civil/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) labels are good places to get started and learn the architecture.
