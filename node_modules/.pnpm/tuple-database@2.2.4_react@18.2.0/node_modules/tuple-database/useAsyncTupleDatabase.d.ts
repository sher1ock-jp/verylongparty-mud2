import { AsyncTupleDatabaseClientApi } from "./database/async/asyncTypes";
import { KeyValuePair } from "./storage/types";
/** Useful for managing UI state for React with a TupleDatabase. */
export declare function useAsyncTupleDatabase<S extends KeyValuePair, T, A extends any[]>(db: AsyncTupleDatabaseClientApi<S>, fn: (db: AsyncTupleDatabaseClientApi<S>, ...arg: A) => Promise<T>, args: A): T | undefined;
//# sourceMappingURL=../src/useAsyncTupleDatabase.d.ts.map