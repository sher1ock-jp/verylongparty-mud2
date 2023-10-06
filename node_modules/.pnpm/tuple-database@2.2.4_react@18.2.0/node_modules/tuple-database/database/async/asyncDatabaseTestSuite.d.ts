import { KeyValuePair } from "../../storage/types";
import { AsyncTupleDatabaseClientApi } from "./asyncTypes";
export declare function asyncDatabaseTestSuite(name: string, createStorage: <S extends KeyValuePair = KeyValuePair>(id: string) => AsyncTupleDatabaseClientApi<S>, durable?: boolean): void;
//# sourceMappingURL=../../../src/database/async/asyncDatabaseTestSuite.d.ts.map