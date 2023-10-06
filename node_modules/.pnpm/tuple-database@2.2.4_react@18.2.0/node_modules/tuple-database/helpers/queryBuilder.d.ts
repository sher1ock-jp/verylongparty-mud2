import { FilterTupleValuePairByPrefix, RemoveTupleValuePairPrefix, TuplePrefix } from "../database/typeHelpers";
import { AsyncTupleDatabaseClientApi, AsyncTupleTransactionApi, ScanArgs, TupleDatabaseClientApi, TupleTransactionApi } from "../main";
import { KeyValuePair, WriteOps } from "../storage/types";
export declare class QueryResult<T> {
    ops: any[];
    constructor(ops?: any[]);
    map: <O>(fn: (value: T) => O) => QueryResult<O>;
    chain: <O>(fn: (value: T) => QueryResult<O>) => QueryResult<O>;
}
export declare class QueryBuilder<S extends KeyValuePair = KeyValuePair> {
    ops: any[];
    constructor(ops?: any[]);
    subspace: <P extends TuplePrefix<S["key"]>>(prefix: P) => QueryBuilder<RemoveTupleValuePairPrefix<S, P>>;
    scan: <T extends S["key"], P extends TuplePrefix<T>>(args?: ScanArgs<T, P> | undefined) => QueryResult<Extract<S, {
        key: import("../database/typeHelpers").TupleToObject<P>;
    }>[]>;
    write: (writes: WriteOps<S>) => QueryResult<void>;
}
export declare function execute<O, S extends KeyValuePair = KeyValuePair>(dbOrTx: TupleDatabaseClientApi<S> | TupleTransactionApi<S>, query: QueryResult<O>): O;
export declare function execute<O, S extends KeyValuePair = KeyValuePair>(dbOrTx: AsyncTupleDatabaseClientApi<S> | AsyncTupleTransactionApi<S>, query: QueryResult<O>): Promise<O>;
//# sourceMappingURL=../../src/helpers/queryBuilder.d.ts.map