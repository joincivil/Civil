"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compilerOptionsSchema = {
    id: '/CompilerOptions',
    properties: {
        contractsDir: { type: 'string' },
        artifactsDir: { type: 'string' },
        solcVersion: { type: 'string', pattern: '^\\d+.\\d+.\\d+$' },
        compilerSettings: { type: 'object' },
        contracts: {
            oneOf: [
                {
                    type: 'string',
                    pattern: '^\\*$',
                },
                {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                },
            ],
        },
    },
    type: 'object',
    required: [],
    additionalProperties: false,
};
//# sourceMappingURL=compiler_options_schema.js.map