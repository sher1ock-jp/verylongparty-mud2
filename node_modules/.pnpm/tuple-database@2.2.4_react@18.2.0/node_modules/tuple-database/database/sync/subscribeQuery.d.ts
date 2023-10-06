type Identity<T> = T;
import { KeyValuePair } from "../../storage/types";
import { TupleDatabaseClientApi } from "./types";
export declare function subscribeQuery<S extends KeyValuePair, T>(db: TupleDatabaseClientApi<S>, fn: (db: TupleDatabaseClientApi<S>) => Identity<T>, callback: (result: T) => void): Identity<{
    result: T;
    destroy: () => void;
}>;
export {};
//# sourceMappingURL=../../../src/database/sync/subscribeQuery.d.ts.map