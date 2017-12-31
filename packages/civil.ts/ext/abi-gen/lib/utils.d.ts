import { ParamKind } from './types';
export declare const utils: {
    solTypeToTsType(paramKind: ParamKind, solType: string): string;
    log(...args: any[]): void;
    getPartialNameFromFileName(filename: string): string;
    getNamedContent(filename: string): {
        name: string;
        content: string;
    };
};
