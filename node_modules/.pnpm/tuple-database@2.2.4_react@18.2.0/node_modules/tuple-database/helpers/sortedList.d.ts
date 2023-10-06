import { Compare } from "./compare";
export declare function set<T>(list: T[], item: T, cmp: Compare<T>): void;
export declare function get<T>(list: T[], item: T, cmp: Compare<T>): T | undefined;
export declare function exists<T>(list: T[], item: T, cmp: Compare<T>): boolean;
export declare function remove<T>(list: T[], item: T, cmp: Compare<T>): T | undefined;
type ScanArgs<T> = {
    gt?: T;
    gte?: T;
    lt?: T;
    lte?: T;
    limit?: number;
    reverse?: boolean;
};
export declare function scan<T>(list: T[], args: ScanArgs<T>, cmp: Compare<T>): T[];
export {};
//# sourceMappingURL=../../src/helpers/sortedList.d.ts.map