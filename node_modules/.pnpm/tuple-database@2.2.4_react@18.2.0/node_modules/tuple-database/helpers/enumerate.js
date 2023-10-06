"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumerateReverse = exports.enumerate = void 0;
function enumerate(array) {
    const pairs = [];
    for (let i = 0; i < array.length; i++) {
        pairs.push([i, array[i]]);
    }
    return pairs;
}
exports.enumerate = enumerate;
function enumerateReverse(array) {
    const pairs = [];
    for (let i = array.length - 1; i >= 0; i--) {
        pairs.push([i, array[i]]);
    }
    return pairs;
}
exports.enumerateReverse = enumerateReverse;
//# sourceMappingURL=../../src/helpers/enumerate.js.map