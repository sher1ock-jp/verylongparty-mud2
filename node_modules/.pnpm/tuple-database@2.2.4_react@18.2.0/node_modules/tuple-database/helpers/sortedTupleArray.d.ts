import { ScanArgs } from "../database/types";
import { Tuple } from "../storage/types";
export declare function set(data: Array<Tuple>, tuple: Tuple): void;
export declare function exists(data: Array<Tuple>, tuple: Tuple): boolean;
export declare function remove(data: Array<Tuple>, tuple: Tuple): Tuple | undefined;
export declare const MaxTuple: boolean[];
/**
 * Gets the tuple bounds taking into account any prefix specified.
 */
export declare function normalizeTupleBounds(args: ScanArgs<Tuple, any>): Bounds;
export declare function getPrefixContainingBounds(bounds: Bounds): Tuple;
export declare function isTupleWithinBounds(tuple: Tuple, bounds: Bounds): boolean;
export type Bounds = {
    /** This prevents developers from accidentally using ScanArgs instead of TupleBounds */
    prefix?: never;
    gte?: Tuple;
    gt?: Tuple;
    lte?: Tuple;
    lt?: Tuple;
};
export declare function scan(data: Array<Tuple>, args?: ScanArgs<Tuple, any>): Tuple[];
//# sourceMappingURL=../../src/helpers/sortedTupleArray.d.ts.map