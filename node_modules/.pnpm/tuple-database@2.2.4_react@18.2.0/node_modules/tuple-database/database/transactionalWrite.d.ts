import { KeyValuePair, WriteOps } from "../storage/types";
import { AsyncTupleDatabaseClientApi, AsyncTupleTransactionApi } from "./async/asyncTypes";
import { TupleDatabaseClientApi, TupleTransactionApi } from "./sync/types";
import { RemoveTupleValuePairPrefix, TuplePrefix, ValueForTuple } from "./typeHelpers";
export type TransactionWriteApi<S extends KeyValuePair> = {
    set: <T extends S["key"]>(tuple: T, value: ValueForTuple<S, T>) => TransactionWriteApi<S>;
    remove: (tuple: S["key"]) => TransactionWriteApi<S>;
    write: (writes: WriteOps<S>) => TransactionWriteApi<S>;
    subspace: <P extends TuplePrefix<S["key"]>>(prefix: P) => TransactionWriteApi<RemoveTupleValuePairPrefix<S, P>>;
};
/**
 * Similar to transactionalReadWrite and transactionalReadWriteAsync but only allows writes.
 */
export declare function transactionalWrite<S extends KeyValuePair = KeyValuePair>(retries?: number): <I extends any[], O>(fn: (tx: TransactionWriteApi<S>, ...args: I) => O) => (dbOrTx: AsyncTupleDatabaseClientApi<S> | AsyncTupleTransactionApi<S> | TupleDatabaseClientApi<S> | TupleTransactionApi<S> | TransactionWriteApi<S>, ...args: I) => O;
//# sourceMappingURL=../../src/database/transactionalWrite.d.ts.map