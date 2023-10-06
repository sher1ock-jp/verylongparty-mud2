"use strict";
/*

This file is generated from async/retryAsync.ts

*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.retry = void 0;
const ConcurrencyLog_1 = require("../../database/ConcurrencyLog");
function retry(retries, fn) {
    while (true) {
        try {
            const result = fn();
            return result;
        }
        catch (error) {
            if (retries <= 0)
                throw error;
            const isConflict = error instanceof ConcurrencyLog_1.ReadWriteConflictError;
            if (!isConflict)
                throw error;
            retries -= 1;
        }
    }
}
exports.retry = retry;
//# sourceMappingURL=../../../src/database/sync/retry.js.map