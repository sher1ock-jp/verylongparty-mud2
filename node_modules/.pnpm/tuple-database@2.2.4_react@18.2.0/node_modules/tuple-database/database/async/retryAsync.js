"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryAsync = void 0;
const ConcurrencyLog_1 = require("../../database/ConcurrencyLog");
async function retryAsync(retries, fn) {
    while (true) {
        try {
            const result = await fn();
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
exports.retryAsync = retryAsync;
//# sourceMappingURL=../../../src/database/async/retryAsync.js.map