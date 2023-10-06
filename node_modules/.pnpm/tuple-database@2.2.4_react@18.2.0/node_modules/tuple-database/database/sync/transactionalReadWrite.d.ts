type Identity<T> = T;
import { KeyValuePair } from "../../main";
import { TupleDatabaseClientApi, TupleTransactionApi } from "./types";
export declare function transactionalReadWrite<S extends KeyValuePair = KeyValuePair>(retries?: number): <I extends any[], O>(fn: (tx: TupleTransactionApi<S>, ...args: I) => O) => (dbOrTx: TupleDatabaseClientApi<S> | TupleTransactionApi<S>, ...args: I) => O;
/** @deprecated */
export declare const transactionalQuery: typeof transactionalReadWrite;
export {};
//# sourceMappingURL=../../../src/database/sync/transactionalReadWrite.d.ts.map