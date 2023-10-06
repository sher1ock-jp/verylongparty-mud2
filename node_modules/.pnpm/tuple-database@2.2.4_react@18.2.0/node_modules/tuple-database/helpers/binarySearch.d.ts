import { Compare } from "./compare";
export type BinarySearchResult = {
    found: number;
    closest?: undefined;
} | {
    found?: undefined;
    closest: number;
};
export declare function generalizedBinarySearch<I, V>(getValue: (item: I) => V, cmp: Compare<V>): (list: Array<I>, item: V) => BinarySearchResult;
export declare function binarySearch<T>(list: T[], item: T, cmp: Compare<T>): BinarySearchResult;
export declare function binarySearchAssociativeList<T>(list: [T, any][], item: T, cmp: Compare<T>): BinarySearchResult;
//# sourceMappingURL=../../src/helpers/binarySearch.d.ts.map