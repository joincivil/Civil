import { ContractSource } from '../types';
import { Resolver } from './resolver';
export declare class FallthroughResolver extends Resolver {
    private readonly _resolvers;
    appendResolver(resolver: Resolver): void;
    resolveIfExists(importPath: string): ContractSource | undefined;
}
