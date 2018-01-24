# civil.ts
[![CircleCI](https://circleci.com/gh/joincivil/civil.ts.svg?style=svg)](https://circleci.com/gh/joincivil/civil.ts)
The core library allowing for interfacing with the whole Civil ecosystem

## Development
### Code generation
Civil.ts uses auto-generated code from Smart-Contract .json artifacts.
Run ```npm run generate-contracts``` to create them in the `src/contracts/generated/` directory, afterwards develop as normal.

The templates for code generation can be found `src/contracts/templates/`.

### Adding new smart-contract
- [ ] Add new .json definition to `src/artifacts`
- [ ] Add the json to `src/artifacts.ts`
- [ ] Run `npm run generate-contracts`
- [ ] Add events into `src/types.ts` -> `CivilEventArgs` type
- [ ] Enjoy automated generated code
