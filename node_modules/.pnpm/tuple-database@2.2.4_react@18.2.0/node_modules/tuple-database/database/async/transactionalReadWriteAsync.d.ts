import { KeyValuePair } from "../../main";
import { AsyncTupleDatabaseClientApi, AsyncTupleTransactionApi } from "./asyncTypes";
export declare function transactionalReadWriteAsync<S extends KeyValuePair = KeyValuePair>(retries?: number): <I extends any[], O>(fn: (tx: AsyncTupleTransactionApi<S>, ...args: I) => Promise<O>) => (dbOrTx: AsyncTupleDatabaseClientApi<S> | AsyncTupleTransactionApi<S>, ...args: I) => Promise<O>;
/** @deprecated */
export declare const transactionalAsyncQuery: typeof transactionalReadWriteAsync;
//# sourceMappingURL=../../../src/database/async/transactionalReadWriteAsync.d.ts.map