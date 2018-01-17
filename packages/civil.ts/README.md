# civil.ts
[![CircleCI](https://circleci.com/gh/joincivil/civil.ts.svg?style=svg)](https://circleci.com/gh/joincivil/civil.ts)
The core library allowing for interfacing with the whole Civil ecosystem

## Development
### Code generation
Civil.ts uses auto-generated code from Smart-Contract .json artifacts.
Run ```npm run generate-contracts``` to create them in the `src/contracts/generated/` directory, afterwards develop as normal.
The templates for code generation can be found `src/contracts/templates/`.

To add a new smart contract to the mix, add a new .json definition to `src/artifacts/` and add it to the list in `src/artifacts.ts`.
Afterwards regenerate contracts with ```npm run generate-contracts``` and use your new shiny generated code.
