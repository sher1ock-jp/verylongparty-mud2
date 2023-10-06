import { AsyncTupleStorageApi, ScanStorageArgs, WriteOps } from "../main";
import { KeyValuePair } from "./types";
export declare class IndexedDbTupleStorage implements AsyncTupleStorageApi {
    dbName: string;
    private db;
    constructor(dbName: string);
    scan(args?: ScanStorageArgs): Promise<KeyValuePair[]>;
    commit(writes: WriteOps): Promise<void>;
    close(): Promise<void>;
}
//# sourceMappingURL=../../src/storage/IndexedDbTupleStorage.d.ts.map