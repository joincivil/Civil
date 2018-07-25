/// <reference types="node" />
import * as fs from 'fs';
export declare const fsWrapper: {
    readdirAsync: (...callArgs: any[]) => Promise<string[]>;
    readFileAsync: (...callArgs: any[]) => Promise<string>;
    writeFileAsync: (...callArgs: any[]) => Promise<undefined>;
    mkdirpAsync: (...callArgs: any[]) => Promise<undefined>;
    doesPathExistSync: typeof fs.existsSync;
    rmdirSync: typeof fs.rmdirSync;
    removeFileAsync: (...callArgs: any[]) => Promise<undefined>;
};
