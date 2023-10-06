"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.binarySearchAssociativeList = exports.binarySearch = exports.generalizedBinarySearch = void 0;
// This binary search is generalized so that we can use it for both normal lists
// as well as associative lists.
function generalizedBinarySearch(getValue, cmp) {
    return function (list, item) {
        var min = 0;
        var max = list.length - 1;
        while (min <= max) {
            var k = (max + min) >> 1;
            var dir = cmp(item, getValue(list[k]));
            if (dir > 0) {
                min = k + 1;
            }
            else if (dir < 0) {
                max = k - 1;
            }
            else {
                return { found: k };
            }
        }
        return { closest: min };
    };
}
exports.generalizedBinarySearch = generalizedBinarySearch;
function binarySearch(list, item, cmp) {
    return generalizedBinarySearch((x) => x, cmp)(list, item);
}
exports.binarySearch = binarySearch;
function binarySearchAssociativeList(list, item, cmp) {
    return generalizedBinarySearch((x) => x[0], cmp)(list, item);
}
exports.binarySearchAssociativeList = binarySearchAssociativeList;
//# sourceMappingURL=../../src/helpers/binarySearch.js.map