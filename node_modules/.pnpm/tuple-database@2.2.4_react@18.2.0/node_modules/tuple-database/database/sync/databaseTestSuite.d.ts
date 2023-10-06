import { KeyValuePair } from "../../storage/types";
import { TupleDatabaseClientApi } from "./types";
export declare function databaseTestSuite(name: string, createStorage: <S extends KeyValuePair = KeyValuePair>(id: string) => TupleDatabaseClientApi<S>, durable?: boolean): void;
//# sourceMappingURL=../../../src/database/sync/databaseTestSuite.d.ts.map