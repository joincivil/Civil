# civil.ts
[![npm (scoped)](https://img.shields.io/npm/v/civil.ts.svg)](https://www.npmjs.com/package/civil.ts)
[![CircleCI](https://circleci.com/gh/joincivil/civil.ts.svg?style=svg)](https://circleci.com/gh/joincivil/civil.ts)

This library is the main-entry point for any developer wanting to work with the Civil ecosystem. It abstracts communication with the Ethereum blockchain as well as storing and loading articles from file storage servers.

## Installation
```
npm install civil.ts --save
```

## Development
### Code generation
Civil.ts uses auto-generated code from Smart-Contract .json artifacts.
Run ```npm run generate-contracts``` to create them in the `src/contracts/generated/` directory, afterwards develop as normal.

The templates for code generation can be found `src/contracts/templates/`.

#### Adding a new smart-contract
- [ ] Add new .json definition to `src/artifacts`
- [ ] Add the json to `src/artifacts.ts`
- [ ] Run `npm run generate-contracts`
- [ ] Add events into `src/types.ts` -> `CivilEventArgs` type
- [ ] Enjoy automated generated code
