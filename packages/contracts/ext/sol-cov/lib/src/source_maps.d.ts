import { LocationByOffset, SourceRange } from './types';
export interface SourceLocation {
    offset: number;
    length: number;
    fileIndex: number;
}
export declare function getLocationByOffset(str: string): LocationByOffset;
export declare function parseSourceMap(sourceCodes: string[], srcMap: string, bytecodeHex: string, sources: string[]): {
    [programCounter: number]: SourceRange;
};
