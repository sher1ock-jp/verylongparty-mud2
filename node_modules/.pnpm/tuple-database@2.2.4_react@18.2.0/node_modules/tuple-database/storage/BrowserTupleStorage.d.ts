import { TupleStorageApi } from "../database/sync/types";
import { InMemoryTupleStorage } from "./InMemoryTupleStorage";
import { WriteOps } from "./types";
export declare class BrowserTupleStorage extends InMemoryTupleStorage implements TupleStorageApi {
    localStorageKey: string;
    constructor(localStorageKey: string);
    commit(writes: WriteOps): void;
}
//# sourceMappingURL=../../src/storage/BrowserTupleStorage.d.ts.map