"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmptyWrites = void 0;
function isEmptyWrites(writes) {
    var _a, _b;
    if ((_a = writes.remove) === null || _a === void 0 ? void 0 : _a.length)
        return false;
    if ((_b = writes.set) === null || _b === void 0 ? void 0 : _b.length)
        return false;
    return true;
}
exports.isEmptyWrites = isEmptyWrites;
//# sourceMappingURL=../../src/helpers/isEmptyWrites.js.map