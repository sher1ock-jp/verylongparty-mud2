"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSubspaceScanArgs = exports.removePrefixFromTupleValuePairs = exports.removePrefixFromTuple = exports.removePrefixFromWriteOps = exports.prependPrefixToWriteOps = exports.prependPrefixToTuple = void 0;
const lodash_1 = require("lodash");
const sortedTupleArray_1 = require("./sortedTupleArray");
function prependPrefixToTuple(prefix, tuple) {
    return [...prefix, ...tuple];
}
exports.prependPrefixToTuple = prependPrefixToTuple;
function prependPrefixToTuples(prefix, tuples) {
    return tuples.map((tuple) => prependPrefixToTuple(prefix, tuple));
}
function prependPrefixToTupleValuePair(prefix, pair) {
    const { key, value } = pair;
    return {
        key: prependPrefixToTuple(prefix, key),
        value,
    };
}
function prependPrefixToTupleValuePairs(prefix, pairs) {
    return pairs.map((pair) => prependPrefixToTupleValuePair(prefix, pair));
}
function prependPrefixToWriteOps(prefix, writes) {
    const set = writes.set
        ? prependPrefixToTupleValuePairs(prefix, writes.set)
        : undefined;
    const remove = writes.remove
        ? prependPrefixToTuples(prefix, writes.remove)
        : undefined;
    return { set, remove };
}
exports.prependPrefixToWriteOps = prependPrefixToWriteOps;
function removePrefixFromWriteOps(prefix, writes) {
    const set = writes.set
        ? removePrefixFromTupleValuePairs(prefix, writes.set)
        : undefined;
    const remove = writes.remove
        ? removePrefixFromTuples(prefix, writes.remove)
        : undefined;
    return { set, remove };
}
exports.removePrefixFromWriteOps = removePrefixFromWriteOps;
function removePrefixFromTuple(prefix, tuple) {
    if (!(0, lodash_1.isEqual)(tuple.slice(0, prefix.length), prefix)) {
        throw new Error("Invalid prefix: " + JSON.stringify({ prefix, tuple }));
    }
    return tuple.slice(prefix.length);
}
exports.removePrefixFromTuple = removePrefixFromTuple;
function removePrefixFromTuples(prefix, tuples) {
    return tuples.map((tuple) => removePrefixFromTuple(prefix, tuple));
}
function removePrefixFromTupleValuePair(prefix, pair) {
    const { key, value } = pair;
    return { key: removePrefixFromTuple(prefix, key), value };
}
function removePrefixFromTupleValuePairs(prefix, pairs) {
    return pairs.map((pair) => removePrefixFromTupleValuePair(prefix, pair));
}
exports.removePrefixFromTupleValuePairs = removePrefixFromTupleValuePairs;
function normalizeSubspaceScanArgs(subspacePrefix, args) {
    const prefix = args.prefix
        ? [...subspacePrefix, ...args.prefix]
        : subspacePrefix;
    const bounds = (0, sortedTupleArray_1.normalizeTupleBounds)({ ...args, prefix });
    const { limit, reverse } = args;
    return (0, lodash_1.omitBy)({ ...bounds, limit, reverse }, (x) => x === undefined);
}
exports.normalizeSubspaceScanArgs = normalizeSubspaceScanArgs;
//# sourceMappingURL=../../src/helpers/subspaceHelpers.js.map