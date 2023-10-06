import { TupleStorageApi } from "../database/sync/types";
import { KeyValuePair, ScanStorageArgs, WriteOps } from "./types";
export declare class InMemoryTupleStorage implements TupleStorageApi {
    data: KeyValuePair[];
    constructor(data?: KeyValuePair[]);
    scan(args?: ScanStorageArgs): KeyValuePair[];
    commit(writes: WriteOps): void;
    close(): void;
}
//# sourceMappingURL=../../src/storage/InMemoryTupleStorage.d.ts.map