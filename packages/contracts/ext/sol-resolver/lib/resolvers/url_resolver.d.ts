import { ContractSource } from '../types';
import { Resolver } from './resolver';
export declare class URLResolver extends Resolver {
    resolveIfExists(importPath: string): ContractSource | undefined;
}
