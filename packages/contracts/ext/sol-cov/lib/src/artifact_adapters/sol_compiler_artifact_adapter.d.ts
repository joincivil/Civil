import { ContractData } from '../types';
import { AbstractArtifactAdapter } from './abstract_artifact_adapter';
export declare class SolCompilerArtifactAdapter extends AbstractArtifactAdapter {
    private readonly _artifactsPath;
    private readonly _sourcesPath;
    constructor(artifactsPath?: string, sourcesPath?: string);
    collectContractsDataAsync(): Promise<ContractData[]>;
}
