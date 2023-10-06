import { KeyValuePair, Tuple, WriteOps } from "../../storage/types";
import { TupleDatabaseApi } from "../sync/types";
import { FilterTupleValuePairByPrefix, RemoveTupleValuePairPrefix, TuplePrefix, ValueForTuple } from "../typeHelpers";
import { ScanArgs, TxId, Unsubscribe } from "../types";
import { AsyncCallback, AsyncTupleDatabaseApi, AsyncTupleDatabaseClientApi, AsyncTupleRootTransactionApi, AsyncTupleTransactionApi } from "./asyncTypes";
export declare class AsyncTupleDatabaseClient<S extends KeyValuePair = KeyValuePair> implements AsyncTupleDatabaseClientApi<S> {
    private db;
    subspacePrefix: Tuple;
    constructor(db: AsyncTupleDatabaseApi | TupleDatabaseApi, subspacePrefix?: Tuple);
    scan<T extends S["key"], P extends TuplePrefix<T>>(args?: ScanArgs<T, P>, txId?: TxId): Promise<FilterTupleValuePairByPrefix<S, P>[]>;
    subscribe<T extends S["key"], P extends TuplePrefix<T>>(args: ScanArgs<T, P>, callback: AsyncCallback<FilterTupleValuePairByPrefix<S, P>>): Promise<Unsubscribe>;
    commit(writes: WriteOps<S>, txId?: TxId): Promise<void>;
    cancel(txId: string): Promise<void>;
    get<T extends S["key"]>(tuple: T, txId?: TxId): Promise<ValueForTuple<S, T> | undefined>;
    exists<T extends S["key"]>(tuple: T, txId?: TxId): Promise<boolean>;
    subspace<P extends TuplePrefix<S["key"]>>(prefix: P): AsyncTupleDatabaseClient<RemoveTupleValuePairPrefix<S, P>>;
    transact(txId?: TxId, writes?: WriteOps<S>): AsyncTupleRootTransactionApi<S>;
    close(): Promise<void>;
}
export declare class AsyncTupleRootTransaction<S extends KeyValuePair> implements AsyncTupleRootTransactionApi<S> {
    private db;
    subspacePrefix: Tuple;
    id: TxId;
    constructor(db: AsyncTupleDatabaseApi | TupleDatabaseApi, subspacePrefix: Tuple, id: TxId, writes?: WriteOps<S>);
    committed: boolean;
    canceled: boolean;
    writes: Required<WriteOps<S>>;
    private checkActive;
    scan<T extends S["key"], P extends TuplePrefix<T>>(args?: ScanArgs<T, P>): Promise<FilterTupleValuePairByPrefix<S, P>[]>;
    get<T extends S["key"]>(tuple: T): Promise<ValueForTuple<S, T> | undefined>;
    exists<T extends S["key"]>(tuple: T): Promise<boolean>;
    set<T extends S>(tuple: T["key"], value: T["value"]): AsyncTupleRootTransactionApi<S>;
    remove(tuple: S["key"]): AsyncTupleRootTransactionApi<S>;
    write(writes: WriteOps<S>): AsyncTupleRootTransactionApi<S>;
    commit(): Promise<void>;
    cancel(): Promise<void>;
    subspace<P extends TuplePrefix<S["key"]>>(prefix: P): AsyncTupleTransactionApi<RemoveTupleValuePairPrefix<S, P>>;
}
export declare class AsyncTupleSubspaceTransaction<S extends KeyValuePair> implements AsyncTupleTransactionApi<S> {
    private tx;
    subspacePrefix: Tuple;
    constructor(tx: AsyncTupleTransactionApi<any>, subspacePrefix: Tuple);
    scan<T extends S["key"], P extends TuplePrefix<T>>(args?: ScanArgs<T, P>): Promise<FilterTupleValuePairByPrefix<S, P>[]>;
    get<T extends S["key"]>(tuple: T): Promise<ValueForTuple<S, T> | undefined>;
    exists<T extends S["key"]>(tuple: T): Promise<boolean>;
    set<T extends S>(tuple: T["key"], value: T["value"]): AsyncTupleTransactionApi<S>;
    remove(tuple: S["key"]): AsyncTupleTransactionApi<S>;
    write(writes: WriteOps<S>): AsyncTupleTransactionApi<S>;
    subspace<P extends TuplePrefix<S["key"]>>(prefix: P): AsyncTupleTransactionApi<RemoveTupleValuePairPrefix<S, P>>;
}
//# sourceMappingURL=../../../src/database/async/AsyncTupleDatabaseClient.d.ts.map