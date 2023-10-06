type Identity<T> = T;
import { KeyValuePair, Tuple, WriteOps } from "../../storage/types";
import { TupleDatabaseApi } from "../sync/types";
import { FilterTupleValuePairByPrefix, RemoveTupleValuePairPrefix, TuplePrefix, ValueForTuple } from "../typeHelpers";
import { ScanArgs, TxId, Unsubscribe } from "../types";
import { Callback, TupleDatabaseClientApi, TupleRootTransactionApi, TupleTransactionApi } from "./types";
export declare class TupleDatabaseClient<S extends KeyValuePair = KeyValuePair> implements TupleDatabaseClientApi<S> {
    private db;
    subspacePrefix: Tuple;
    constructor(db: TupleDatabaseApi | TupleDatabaseApi, subspacePrefix?: Tuple);
    scan<T extends S["key"], P extends TuplePrefix<T>>(args?: ScanArgs<T, P>, txId?: TxId): Identity<FilterTupleValuePairByPrefix<S, P>[]>;
    subscribe<T extends S["key"], P extends TuplePrefix<T>>(args: ScanArgs<T, P>, callback: Callback<FilterTupleValuePairByPrefix<S, P>>): Identity<Unsubscribe>;
    commit(writes: WriteOps<S>, txId?: TxId): Identity<void>;
    cancel(txId: string): void;
    get<T extends S["key"]>(tuple: T, txId?: TxId): Identity<ValueForTuple<S, T> | undefined>;
    exists<T extends S["key"]>(tuple: T, txId?: TxId): Identity<boolean>;
    subspace<P extends TuplePrefix<S["key"]>>(prefix: P): TupleDatabaseClient<RemoveTupleValuePairPrefix<S, P>>;
    transact(txId?: TxId, writes?: WriteOps<S>): TupleRootTransactionApi<S>;
    close(): void;
}
export declare class TupleRootTransaction<S extends KeyValuePair> implements TupleRootTransactionApi<S> {
    private db;
    subspacePrefix: Tuple;
    id: TxId;
    constructor(db: TupleDatabaseApi | TupleDatabaseApi, subspacePrefix: Tuple, id: TxId, writes?: WriteOps<S>);
    committed: boolean;
    canceled: boolean;
    writes: Required<WriteOps<S>>;
    private checkActive;
    scan<T extends S["key"], P extends TuplePrefix<T>>(args?: ScanArgs<T, P>): Identity<FilterTupleValuePairByPrefix<S, P>[]>;
    get<T extends S["key"]>(tuple: T): Identity<ValueForTuple<S, T> | undefined>;
    exists<T extends S["key"]>(tuple: T): Identity<boolean>;
    set<T extends S>(tuple: T["key"], value: T["value"]): TupleRootTransactionApi<S>;
    remove(tuple: S["key"]): TupleRootTransactionApi<S>;
    write(writes: WriteOps<S>): TupleRootTransactionApi<S>;
    commit(): void;
    cancel(): void;
    subspace<P extends TuplePrefix<S["key"]>>(prefix: P): TupleTransactionApi<RemoveTupleValuePairPrefix<S, P>>;
}
export declare class TupleSubspaceTransaction<S extends KeyValuePair> implements TupleTransactionApi<S> {
    private tx;
    subspacePrefix: Tuple;
    constructor(tx: TupleTransactionApi<any>, subspacePrefix: Tuple);
    scan<T extends S["key"], P extends TuplePrefix<T>>(args?: ScanArgs<T, P>): Identity<FilterTupleValuePairByPrefix<S, P>[]>;
    get<T extends S["key"]>(tuple: T): Identity<ValueForTuple<S, T> | undefined>;
    exists<T extends S["key"]>(tuple: T): Identity<boolean>;
    set<T extends S>(tuple: T["key"], value: T["value"]): TupleTransactionApi<S>;
    remove(tuple: S["key"]): TupleTransactionApi<S>;
    write(writes: WriteOps<S>): TupleTransactionApi<S>;
    subspace<P extends TuplePrefix<S["key"]>>(prefix: P): TupleTransactionApi<RemoveTupleValuePairPrefix<S, P>>;
}
export {};
//# sourceMappingURL=../../../src/database/sync/TupleDatabaseClient.d.ts.map