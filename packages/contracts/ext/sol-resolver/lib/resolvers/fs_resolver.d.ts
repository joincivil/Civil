import { ContractSource } from '../types';
import { Resolver } from './resolver';
export declare class FSResolver extends Resolver {
    resolveIfExists(importPath: string): ContractSource | undefined;
}
