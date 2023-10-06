"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutableFilter = void 0;
function mutableFilter(array, fn) {
    let i = 0;
    while (true) {
        if (i >= array.length)
            break;
        const item = array[i];
        if (fn(item)) {
            i++;
        }
        else {
            array.splice(i, 1);
        }
    }
}
exports.mutableFilter = mutableFilter;
//# sourceMappingURL=../../src/helpers/mutableFilter.js.map