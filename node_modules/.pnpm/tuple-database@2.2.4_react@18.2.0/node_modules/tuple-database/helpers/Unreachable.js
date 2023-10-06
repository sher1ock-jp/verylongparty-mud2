"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnreachableError = void 0;
class UnreachableError extends Error {
    constructor(obj, message) {
        super((message + ": " || "Unreachable: ") + obj);
    }
}
exports.UnreachableError = UnreachableError;
//# sourceMappingURL=../../src/helpers/Unreachable.js.map