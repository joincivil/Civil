# @joincivil/typescript-typings

This package is a Typescript typeRoot of all typings of external packages that otherwise have no types of their own.

[![license](https://img.shields.io/badge/license-Apache%20v2.0-green.svg)](./LICENSE)

## Reasoning

Some of the types are not in the main DefintelyTyped repository, while others are written by us.
We're using this package to increase velocity of updating types. Getting stuff into the main repo takes a week,
which is too slow for us at the current stage.

All of the types here are designed to not add any functionallity except the one existing in the packages themselves

## Usage

Install this package.

```bash
yarn add --dev @joincivil/typescript-typings
```

Update your `tsconfig.json` to include additional type root.

```
{
  {
  "compilerOptions": {
    "typeRoots": ["node_modules/@joincivil/typescript-typings/types", "node_modules/@types"]
  }
}
```

Proceed as normal, happier.
