import { InMemoryTupleStorage } from "./InMemoryTupleStorage";
import { KeyValuePair, WriteOps } from "./types";
export declare function parseFile(str: string): KeyValuePair[];
export declare class FileTupleStorage extends InMemoryTupleStorage {
    dbPath: string;
    cache: FileCache;
    constructor(dbPath: string);
    commit(writes: WriteOps): void;
}
declare class FileCache {
    private dbPath;
    constructor(dbPath: string);
    private getFilePath;
    get(): KeyValuePair[];
    set(data: KeyValuePair[]): void;
}
export {};
//# sourceMappingURL=../../src/storage/FileTupleStorage.d.ts.map