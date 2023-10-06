import { KeyValuePair, Tuple } from "../storage/types";
export type Assert<Actual extends Expected, Expected> = Actual;
export type Ints = `${number}`;
/** Convert ["a", "b"] in {0: "a", 1: "b"} so that we can use Extract to match tuple prefixes. */
export type TupleToObject<T extends any[]> = Pick<T, Extract<keyof T, Ints>>;
export type FilterTupleByPrefix<S extends Tuple, P extends Tuple> = Extract<S, TupleToObject<P>>;
export type FilterTupleValuePairByPrefix<S extends KeyValuePair, P extends Tuple> = Extract<S, {
    key: TupleToObject<P>;
}>;
export type FilterTupleValuePair<S extends KeyValuePair, P extends Tuple> = Extract<S, {
    key: P;
}>;
type DistributiveProp<T, K extends keyof T> = T extends unknown ? T[K] : never;
export type ValueForTuple<S extends KeyValuePair, P extends Tuple> = DistributiveProp<FilterTupleValuePairByPrefix<S, P>, "value">;
export type IsTuple = [] | {
    0: any;
};
export type TuplePrefix<T extends unknown[]> = T extends IsTuple ? T extends [any, ...infer U] ? [] | [T[0]] | [T[0], ...TuplePrefix<U>] : [] : T | [];
export type TupleRest<T extends unknown[]> = T extends [any, ...infer U] ? U : never;
export type RemoveTuplePrefix<T, P extends any[]> = T extends IsTuple ? T extends [...P, ...infer U] ? U : never : T;
export type RemoveTupleValuePairPrefix<T extends KeyValuePair, P extends any[]> = T extends {
    key: [...P, ...infer U];
    value: infer V;
} ? {
    key: U;
    value: V;
} : never;
export type SchemaSubspace<P extends Tuple, T extends KeyValuePair> = T extends unknown ? {
    key: [...P, ...T["key"]];
    value: T["value"];
} : never;
export {};
//# sourceMappingURL=../../src/database/typeHelpers.d.ts.map