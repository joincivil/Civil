import { TraceCollectionSubprovider } from './trace_collection_subprovider';
import { TraceInfo } from './types';
export declare abstract class TraceInfoSubprovider extends TraceCollectionSubprovider {
    protected abstract _handleTraceInfoAsync(traceInfo: TraceInfo): Promise<void>;
    protected _recordTxTraceAsync(address: string, data: string | undefined, txHash: string): Promise<void>;
}
