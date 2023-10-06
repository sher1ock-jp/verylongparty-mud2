export type Value = string | number | boolean | null | Array<Value> | object;
export type Tuple = Value[];
export type KeyValuePair = {
    key: Tuple;
    value: any;
};
export declare const MIN: null;
export declare const MAX = true;
export type WriteOps<S extends KeyValuePair = KeyValuePair> = {
    set?: S[];
    remove?: S["key"][];
};
export type ScanStorageArgs = {
    gt?: Tuple;
    gte?: Tuple;
    lt?: Tuple;
    lte?: Tuple;
    limit?: number;
    reverse?: boolean;
};
//# sourceMappingURL=../../src/storage/types.d.ts.map