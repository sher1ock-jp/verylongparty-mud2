import { Bounds } from "../helpers/sortedTupleArray";
import { Tuple } from "../storage/types";
import { TxId } from "./types";
type ReadItem = {
    type: "read";
    bounds: Bounds;
    txId: TxId;
};
type WriteItem = {
    type: "write";
    tuple: Tuple;
    txId: TxId | undefined;
};
type LogItem = ReadItem | WriteItem;
export declare class ReadWriteConflictError extends Error {
    constructor(txId: string | undefined, writeTuple: Tuple, readBounds: Bounds);
}
export declare class ConcurrencyLog {
    log: LogItem[];
    /** Record a read. */
    read(txId: TxId, bounds: Bounds): void;
    /** Add writes to the log only if there is a conflict with a read. */
    write(txId: TxId | undefined, tuple: Tuple): void;
    /** Determine if any reads conflict with writes. */
    commit(txId: TxId): void;
    cancel(txId: TxId): void;
    /** Cleanup any reads for this transaction. */
    cleanupReads(txId: string): void;
    /** Cleanup any writes that don't have conflicting reads. */
    cleanupWrites(): void;
}
export {};
//# sourceMappingURL=../../src/database/ConcurrencyLog.d.ts.map