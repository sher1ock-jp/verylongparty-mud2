import { KeyValuePair } from "../../storage/types";
import { AsyncTupleDatabaseClientApi } from "./asyncTypes";
export declare function subscribeQueryAsync<S extends KeyValuePair, T>(db: AsyncTupleDatabaseClientApi<S>, fn: (db: AsyncTupleDatabaseClientApi<S>) => Promise<T>, callback: (result: T) => void): Promise<{
    result: T;
    destroy: () => void;
}>;
//# sourceMappingURL=../../../src/database/async/subscribeQueryAsync.d.ts.map