import { Level } from "level";
import { AsyncTupleStorageApi } from "../database/async/asyncTypes";
import { KeyValuePair, ScanStorageArgs, WriteOps } from "./types";
export declare class LevelTupleStorage implements AsyncTupleStorageApi {
    db: Level;
    /**
     * import level from "level"
     * new LevelTupleStorage(level("path/to.db"))
     */
    constructor(db: Level);
    scan(args?: ScanStorageArgs): Promise<KeyValuePair[]>;
    commit(writes: WriteOps): Promise<void>;
    close(): Promise<void>;
}
//# sourceMappingURL=../../src/storage/LevelTupleStorage.d.ts.map