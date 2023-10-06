"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scan = exports.exists = exports.get = exports.remove = exports.set = void 0;
const compareTuple_1 = require("./compareTuple");
const sortedList = __importStar(require("./sortedList"));
const sortedTupleArray_1 = require("./sortedTupleArray");
function compareTupleValuePair(a, b) {
    return (0, compareTuple_1.compareTuple)(a.key, b.key);
}
function compareTupleValuePairReverse(a, b) {
    return (0, compareTuple_1.compareTuple)(a.key, b.key) * -1;
}
function set(data, key, value, reverse = false) {
    return sortedList.set(data, { key, value }, reverse ? compareTupleValuePairReverse : compareTupleValuePair);
}
exports.set = set;
function remove(data, key, reverse = false) {
    return sortedList.remove(data, { key, value: null }, reverse ? compareTupleValuePairReverse : compareTupleValuePair);
}
exports.remove = remove;
function get(data, key, reverse = false) {
    const pair = sortedList.get(data, { key, value: null }, reverse ? compareTupleValuePairReverse : compareTupleValuePair);
    if (pair !== undefined)
        return pair.value;
}
exports.get = get;
function exists(data, key, reverse = false) {
    return sortedList.exists(data, { key, value: null }, reverse ? compareTupleValuePairReverse : compareTupleValuePair);
}
exports.exists = exists;
function normalizeTupleValuePairBounds(args) {
    const bounds = (0, sortedTupleArray_1.normalizeTupleBounds)(args);
    const { gt, lt, gte, lte } = bounds;
    return {
        gt: gt ? { key: gt, value: null } : undefined,
        gte: gte ? { key: gte, value: null } : undefined,
        lt: lt ? { key: lt, value: null } : undefined,
        lte: lte ? { key: lte, value: null } : undefined,
    };
}
function scan(data, args = {}) {
    const { limit, reverse, ...rest } = args;
    const bounds = normalizeTupleValuePairBounds(rest);
    return sortedList.scan(data, { limit, reverse, ...bounds }, compareTupleValuePair);
}
exports.scan = scan;
//# sourceMappingURL=../../src/helpers/sortedTupleValuePairs.js.map