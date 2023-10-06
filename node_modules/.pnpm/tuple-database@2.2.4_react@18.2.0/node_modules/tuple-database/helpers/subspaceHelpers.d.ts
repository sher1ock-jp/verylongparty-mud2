import { ScanArgs } from "../database/types";
import { KeyValuePair, ScanStorageArgs, Tuple, WriteOps } from "../storage/types";
export declare function prependPrefixToTuple(prefix: Tuple, tuple: Tuple): Tuple;
export declare function prependPrefixToWriteOps(prefix: Tuple, writes: WriteOps): WriteOps;
export declare function removePrefixFromWriteOps(prefix: Tuple, writes: WriteOps): WriteOps;
export declare function removePrefixFromTuple(prefix: Tuple, tuple: Tuple): import("../storage/types").Value[];
export declare function removePrefixFromTupleValuePairs(prefix: Tuple, pairs: KeyValuePair[]): KeyValuePair[];
export declare function normalizeSubspaceScanArgs(subspacePrefix: Tuple, args: ScanArgs<Tuple, any>): ScanStorageArgs;
//# sourceMappingURL=../../src/helpers/subspaceHelpers.d.ts.map