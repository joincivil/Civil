import { StructLog } from 'ethereum-types';
import { EvmCallStack } from './types';
export declare function getRevertTrace(structLogs: StructLog[], startAddress: string): EvmCallStack;
