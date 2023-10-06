import { ScanArgs } from "../database/types";
import { KeyValuePair, Tuple } from "../storage/types";
export declare function set(data: KeyValuePair[], key: Tuple, value: any, reverse?: boolean): void;
export declare function remove(data: KeyValuePair[], key: Tuple, reverse?: boolean): KeyValuePair | undefined;
export declare function get(data: KeyValuePair[], key: Tuple, reverse?: boolean): any;
export declare function exists(data: KeyValuePair[], key: Tuple, reverse?: boolean): boolean;
export declare function scan(data: KeyValuePair[], args?: ScanArgs<Tuple, any>): KeyValuePair[];
//# sourceMappingURL=../../src/helpers/sortedTupleValuePairs.d.ts.map