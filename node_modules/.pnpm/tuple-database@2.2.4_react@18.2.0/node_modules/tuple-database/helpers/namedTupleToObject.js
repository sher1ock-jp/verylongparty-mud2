"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.namedTupleToObject = void 0;
const lodash_1 = require("lodash");
function isNamedTupleItem(value) {
    return (0, lodash_1.isPlainObject)(value);
}
function namedTupleToObject(key) {
    const obj = key
        .filter(isNamedTupleItem)
        .reduce((obj, item) => Object.assign(obj, item), {});
    return obj;
}
exports.namedTupleToObject = namedTupleToObject;
//# sourceMappingURL=../../src/helpers/namedTupleToObject.js.map