"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shallowEqual = void 0;
const lodash_1 = require("lodash");
function shallowEqual(a, b) {
    if (a == b)
        return true;
    if ((0, lodash_1.isArray)(a)) {
        if (!(0, lodash_1.isArray)(b))
            return false;
        if (a.length !== b.length)
            return false;
        return a.every((x, i) => b[i] === x);
    }
    if ((0, lodash_1.isPlainObject)(a)) {
        if (!(0, lodash_1.isPlainObject)(b))
            return false;
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length)
            return false;
        const sameKeys = (0, lodash_1.intersection)(aKeys, bKeys);
        if (aKeys.length !== sameKeys.length)
            return false;
        return aKeys.every((key) => a[key] == b[key]);
    }
    return false;
}
exports.shallowEqual = shallowEqual;
//# sourceMappingURL=../../src/helpers/shallowEqual.js.map