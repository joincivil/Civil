import { StructLog } from 'ethereum-types';
export interface TraceByContractAddress {
    [contractAddress: string]: StructLog[];
}
export declare function getTracesByContractAddress(structLogs: StructLog[], startAddress: string): TraceByContractAddress;
