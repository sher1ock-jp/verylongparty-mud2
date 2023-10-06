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
exports.scan = exports.isTupleWithinBounds = exports.getPrefixContainingBounds = exports.normalizeTupleBounds = exports.MaxTuple = exports.remove = exports.exists = exports.set = void 0;
const lodash_1 = require("lodash");
const types_1 = require("../storage/types");
const compareTuple_1 = require("./compareTuple");
const sortedList = __importStar(require("./sortedList"));
function set(data, tuple) {
    return sortedList.set(data, tuple, compareTuple_1.compareTuple);
}
exports.set = set;
function exists(data, tuple) {
    return sortedList.exists(data, tuple, compareTuple_1.compareTuple);
}
exports.exists = exists;
function remove(data, tuple) {
    return sortedList.remove(data, tuple, compareTuple_1.compareTuple);
}
exports.remove = remove;
exports.MaxTuple = [types_1.MAX, types_1.MAX, types_1.MAX, types_1.MAX, types_1.MAX, types_1.MAX, types_1.MAX, types_1.MAX, types_1.MAX, types_1.MAX];
/**
 * Gets the tuple bounds taking into account any prefix specified.
 */
function normalizeTupleBounds(args) {
    let gte;
    let gt;
    let lte;
    let lt;
    if (args.gte) {
        if (args.prefix) {
            gte = [...args.prefix, ...args.gte];
        }
        else {
            gte = [...args.gte];
        }
    }
    else if (args.gt) {
        if (args.prefix) {
            gt = [...args.prefix, ...args.gt];
        }
        else {
            gt = [...args.gt];
        }
    }
    else if (args.prefix) {
        gte = [...args.prefix];
    }
    if (args.lte) {
        if (args.prefix) {
            lte = [...args.prefix, ...args.lte];
        }
        else {
            lte = [...args.lte];
        }
    }
    else if (args.lt) {
        if (args.prefix) {
            lt = [...args.prefix, ...args.lt];
        }
        else {
            lt = [...args.lt];
        }
    }
    else if (args.prefix) {
        // [MAX] is less than [true, "hello"]
        // So we're counting on there not being a really long, all true tuple.
        // TODO: ideally, we'd either specify a max tuple length, or we'd go
        // back to using symbols.
        lte = [...args.prefix, ...exports.MaxTuple];
    }
    return (0, lodash_1.omitBy)({ gte, gt, lte, lt }, (x) => x === undefined);
}
exports.normalizeTupleBounds = normalizeTupleBounds;
function getPrefixContainingBounds(bounds) {
    const prefix = [];
    const start = bounds.gt || bounds.gte || [];
    const end = bounds.lt || bounds.lte || [];
    const len = Math.min(start.length, end.length);
    for (let i = 0; i < len; i++) {
        if (start[i] === end[i]) {
            prefix.push(start[i]);
        }
        else {
            break;
        }
    }
    return prefix;
}
exports.getPrefixContainingBounds = getPrefixContainingBounds;
function isTupleWithinBounds(tuple, bounds) {
    if (bounds.gt) {
        if ((0, compareTuple_1.compareTuple)(tuple, bounds.gt) !== 1) {
            return false;
        }
    }
    if (bounds.gte) {
        if ((0, compareTuple_1.compareTuple)(tuple, bounds.gte) === -1) {
            return false;
        }
    }
    if (bounds.lt) {
        if ((0, compareTuple_1.compareTuple)(tuple, bounds.lt) !== -1) {
            return false;
        }
    }
    if (bounds.lte) {
        if ((0, compareTuple_1.compareTuple)(tuple, bounds.lte) === 1) {
            return false;
        }
    }
    return true;
}
exports.isTupleWithinBounds = isTupleWithinBounds;
function scan(data, args = {}) {
    const { limit, reverse, ...rest } = args;
    const bounds = normalizeTupleBounds(rest);
    return sortedList.scan(data, { limit, reverse, ...bounds }, compareTuple_1.compareTuple);
}
exports.scan = scan;
//# sourceMappingURL=../../src/helpers/sortedTupleArray.js.map