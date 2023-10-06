import { Database } from "better-sqlite3";
import { TupleStorageApi } from "../database/sync/types";
import { KeyValuePair, ScanStorageArgs, WriteOps } from "./types";
export declare class SQLiteTupleStorage implements TupleStorageApi {
    private db;
    /**
     * import sqlite from "better-sqlite3"
     * new SQLiteTupleStorage(sqlite("path/to.db"))
     */
    constructor(db: Database);
    private writeFactsQuery;
    scan: (args?: ScanStorageArgs) => KeyValuePair[];
    commit: (writes: WriteOps) => void;
    close(): void;
}
//# sourceMappingURL=../../src/storage/SQLiteTupleStorage.d.ts.map