"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionalAsyncQuery = exports.transactionalReadWriteAsync = void 0;
const retryAsync_1 = require("./retryAsync");
// Similar to FoundationDb's abstraction: https://apple.github.io/foundationdb/class-scheduling.html
// Accepts a transaction or a database and allows you to compose transactions together.
// This outer function is just used for the schema type because currying is the only way
// we can partially infer generic type parameters.
// https://stackoverflow.com/questions/60377365/typescript-infer-type-of-generic-after-optional-first-generic
function transactionalReadWriteAsync(retries = 5) {
    return function (fn) {
        return async function (dbOrTx, ...args) {
            if (!("transact" in dbOrTx))
                return fn(dbOrTx, ...args);
            return await (0, retryAsync_1.retryAsync)(retries, async () => {
                const tx = dbOrTx.transact();
                const result = await fn(tx, ...args);
                await tx.commit();
                return result;
            });
        };
    };
}
exports.transactionalReadWriteAsync = transactionalReadWriteAsync;
/** @deprecated */
exports.transactionalAsyncQuery = transactionalReadWriteAsync;
//# sourceMappingURL=../../../src/database/async/transactionalReadWriteAsync.js.map