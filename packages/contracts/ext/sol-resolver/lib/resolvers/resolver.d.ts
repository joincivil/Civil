import { ContractSource } from '../types';
export declare abstract class Resolver {
    abstract resolveIfExists(importPath: string): ContractSource | undefined;
    resolve(importPath: string): ContractSource;
}
