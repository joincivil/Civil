# tslint-rules
[![npm (scoped)](https://img.shields.io/npm/v/@joincivil/tslint-rules.svg)](https://www.npmjs.com/package/@joincivil/tslint-rules)

Shared rules for Typescript linter

The rules are strict by default to see what works.
If any of the rules is too strict for the everyday work, we cna then turn it off

## Installation
```
npm install --save-dev @joincivil/tslint-rules
```
and in your ```tslint.json``` or ```tslint.yaml``` put:
```json
{
  "extends": [
    "@joincivil/tslint-rules"
  ]
}
```

Rememmber that many rules require the ```--project``` flag to work properly.
