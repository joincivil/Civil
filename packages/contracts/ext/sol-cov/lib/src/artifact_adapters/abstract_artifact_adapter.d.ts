import { ContractData } from '../types';
export declare abstract class AbstractArtifactAdapter {
    abstract collectContractsDataAsync(): Promise<ContractData[]>;
}
