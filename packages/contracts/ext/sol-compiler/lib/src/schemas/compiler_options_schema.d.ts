export declare const compilerOptionsSchema: {
    id: string;
    properties: {
        contractsDir: {
            type: string;
        };
        artifactsDir: {
            type: string;
        };
        solcVersion: {
            type: string;
            pattern: string;
        };
        compilerSettings: {
            type: string;
        };
        contracts: {
            oneOf: ({
                type: string;
                pattern: string;
                items?: undefined;
            } | {
                type: string;
                items: {
                    type: string;
                };
                pattern?: undefined;
            })[];
        };
    };
    type: string;
    required: never[];
    additionalProperties: boolean;
};
