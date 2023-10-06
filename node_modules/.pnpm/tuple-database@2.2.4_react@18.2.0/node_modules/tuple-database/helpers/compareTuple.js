"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TupleToString = exports.ValueToString = exports.compareTuple = exports.compareValue = void 0;
const lodash_1 = require("lodash");
const codec_1 = require("./codec");
const compare_1 = require("./compare");
const Unreachable_1 = require("./Unreachable");
function compareValue(a, b) {
    const at = (0, codec_1.encodingTypeOf)(a);
    const bt = (0, codec_1.encodingTypeOf)(b);
    if (at === bt) {
        if (at === "array") {
            return compareTuple(a, b);
        }
        else if (at === "object") {
            if (a === b)
                return 0;
            // TODO: prototype.compare for classes.
            // NOTE: it's a bit contentious to allow for unsortable data inside a sorted array.
            // But it is convenient at times to be able to do this sometimes and just assume that
            // thee classes are unsorted.
            if ((0, lodash_1.isPlainObject)(a)) {
                if ((0, lodash_1.isPlainObject)(b)) {
                    // Plain objects are ordered.
                    // This is convenient for meta types like `{date: "2021-12-01"}` =>  [["date", "2021-12-01"]]
                    return compareObject(a, b);
                }
                else {
                    // json > class
                    return -1;
                }
            }
            else if ((0, lodash_1.isPlainObject)(b)) {
                // json > class
                return 1;
            }
            else {
                // class != class
                return 1;
            }
        }
        else if (at === "boolean") {
            return (0, compare_1.compare)(a, b);
        }
        else if (at === "null") {
            return 0;
        }
        else if (at === "number") {
            return (0, compare_1.compare)(a, b);
        }
        else if (at === "string") {
            return (0, compare_1.compare)(a, b);
        }
        else {
            throw new Unreachable_1.UnreachableError(at);
        }
    }
    return (0, compare_1.compare)(codec_1.encodingRank.indexOf(at), codec_1.encodingRank.indexOf(bt));
}
exports.compareValue = compareValue;
function compareObject(a, b) {
    const ae = Object.entries(a)
        .filter(([k, v]) => v !== undefined)
        .sort(([k1], [k2]) => (0, compare_1.compare)(k1, k2));
    const be = Object.entries(b)
        .filter(([k, v]) => v !== undefined)
        .sort(([k1], [k2]) => (0, compare_1.compare)(k1, k2));
    const len = Math.min(ae.length, be.length);
    for (let i = 0; i < len; i++) {
        const [ak, av] = ae[i];
        const [bk, bv] = be[i];
        const dir = compareValue(ak, bk);
        if (dir === 0) {
            const dir2 = compareValue(av, bv);
            if (dir2 === 0) {
                continue;
            }
            return dir2;
        }
        return dir;
    }
    if (ae.length > be.length) {
        return 1;
    }
    else if (ae.length < be.length) {
        return -1;
    }
    else {
        return 0;
    }
}
function compareTuple(a, b) {
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
        const dir = compareValue(a[i], b[i]);
        if (dir === 0) {
            continue;
        }
        return dir;
    }
    if (a.length > b.length) {
        return 1;
    }
    else if (a.length < b.length) {
        return -1;
    }
    else {
        return 0;
    }
}
exports.compareTuple = compareTuple;
function ValueToString(value) {
    if (value === null) {
        return "null";
    }
    else {
        return JSON.stringify(value);
    }
}
exports.ValueToString = ValueToString;
function TupleToString(tuple) {
    return `[${tuple.map(ValueToString).join(",")}]`;
}
exports.TupleToString = TupleToString;
//# sourceMappingURL=../../src/helpers/compareTuple.js.map