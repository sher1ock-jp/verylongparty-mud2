import { TupleDatabaseClientApi } from "./database/sync/types";
import { KeyValuePair } from "./storage/types";
/** Useful for managing UI state for React with a TupleDatabase. */
export declare function useTupleDatabase<S extends KeyValuePair, T, A extends any[]>(db: TupleDatabaseClientApi<S>, fn: (db: TupleDatabaseClientApi<S>, ...arg: A) => T, args: A): T;
//# sourceMappingURL=../src/useTupleDatabase.d.ts.map