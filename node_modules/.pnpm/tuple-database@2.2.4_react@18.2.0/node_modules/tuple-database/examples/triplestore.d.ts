export type Value = string | number | boolean;
export type Fact = [string, string, Value];
export type TriplestoreSchema = {
    key: ["eav", ...Fact];
    value: null;
} | {
    key: ["ave", string, Value, string];
    value: null;
} | {
    key: ["vea", Value, string, string];
    value: null;
};
export declare const writeFact: (dbOrTx: import("../main").TupleTransactionApi<TriplestoreSchema> | import("../main").TupleDatabaseClientApi<TriplestoreSchema>, fact: Fact) => void;
export declare const removeFact: (dbOrTx: import("../main").TupleTransactionApi<TriplestoreSchema> | import("../main").TupleDatabaseClientApi<TriplestoreSchema>, fact: Fact) => void;
export declare class Variable {
    name: string;
    constructor(name: string);
}
export declare function $(name: string): Variable;
export type Expression = [
    Fact[0] | Variable,
    Fact[1] | Variable,
    Fact[2] | Variable
];
export type Binding = {
    [varName: string]: Value;
};
export declare const queryExpression: (dbOrTx: import("../main").TupleTransactionApi<TriplestoreSchema> | import("../main").TupleDatabaseClientApi<TriplestoreSchema>, expr: Expression) => Binding[];
export type Query = Expression[];
export declare function substituteBinding(query: Query, binding: Binding): Query;
export declare const evaluateQuery: (dbOrTx: import("../main").TupleTransactionApi<TriplestoreSchema> | import("../main").TupleDatabaseClientApi<TriplestoreSchema>, query: Query) => Binding[];
//# sourceMappingURL=../../src/examples/triplestore.d.ts.map