import { Tuple, Value } from "../storage/types";
type NamedTupleItem = {
    [key: string | number]: Value;
};
export type NamedTupleToObject<T extends Tuple> = CleanUnionToIntersection<Extract<T[number], NamedTupleItem>>;
export declare function namedTupleToObject<T extends Tuple>(key: T): CleanUnionToIntersection<Extract<T[number], NamedTupleItem>>;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type CleanUnionToIntersection<U> = UnionToIntersection<U> extends infer O ? {
    [K in keyof O]: O[K];
} : never;
export {};
//# sourceMappingURL=../../src/helpers/namedTupleToObject.d.ts.map