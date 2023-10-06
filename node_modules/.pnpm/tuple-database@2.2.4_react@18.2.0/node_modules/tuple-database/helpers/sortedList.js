"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scan = exports.remove = exports.exists = exports.get = exports.set = void 0;
const binarySearch_1 = require("./binarySearch");
function set(list, item, cmp) {
    const result = (0, binarySearch_1.binarySearch)(list, item, cmp);
    if (result.found !== undefined) {
        // Replace the whole item.
        list.splice(result.found, 1, item);
    }
    else {
        // Insert at missing index.
        list.splice(result.closest, 0, item);
    }
}
exports.set = set;
function get(list, item, cmp) {
    const result = (0, binarySearch_1.binarySearch)(list, item, cmp);
    if (result.found === undefined)
        return;
    return list[result.found];
}
exports.get = get;
function exists(list, item, cmp) {
    const result = (0, binarySearch_1.binarySearch)(list, item, cmp);
    return result.found !== undefined;
}
exports.exists = exists;
function remove(list, item, cmp) {
    let { found } = (0, binarySearch_1.binarySearch)(list, item, cmp);
    if (found !== undefined) {
        // Remove from index.
        return list.splice(found, 1)[0];
    }
}
exports.remove = remove;
function scan(list, args, cmp) {
    const start = args.gte || args.gt;
    const end = args.lte || args.lt;
    if (start !== undefined && end !== undefined && cmp(start, end) > 0) {
        throw new Error("Invalid bounds.");
    }
    let lowerSearchBound;
    let upperSearchBound;
    if (start === undefined) {
        lowerSearchBound = 0;
    }
    else {
        const result = (0, binarySearch_1.binarySearch)(list, start, cmp);
        if (result.found === undefined) {
            lowerSearchBound = result.closest;
        }
        else {
            if (args.gt)
                lowerSearchBound = result.found + 1;
            else
                lowerSearchBound = result.found;
        }
    }
    if (end === undefined) {
        upperSearchBound = list.length;
    }
    else {
        const result = (0, binarySearch_1.binarySearch)(list, end, cmp);
        if (result.found === undefined) {
            upperSearchBound = result.closest;
        }
        else {
            if (args.lt)
                upperSearchBound = result.found;
            else
                upperSearchBound = result.found + 1;
        }
    }
    const lowerDataBound = args.reverse && args.limit
        ? Math.max(lowerSearchBound, upperSearchBound - args.limit)
        : lowerSearchBound;
    const upperDataBound = !args.reverse && args.limit
        ? Math.min(lowerSearchBound + args.limit, upperSearchBound)
        : upperSearchBound;
    return args.reverse
        ? list.slice(lowerDataBound, upperDataBound).reverse()
        : list.slice(lowerDataBound, upperDataBound);
}
exports.scan = scan;
//# sourceMappingURL=../../src/helpers/sortedList.js.map