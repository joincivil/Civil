import * as Web3 from 'web3';
import { ParamKind } from './types';
export declare const utils: {
    solTypeToTsType(paramKind: ParamKind, solType: string): string;
    log(...args: any[]): void;
    getPartialNameFromFileName(filename: string): string;
    getNamedContent(filename: string): {
        name: string;
        content: string;
    };
    getEmptyConstructor(): Web3.ConstructorAbi;
};
