"use strict";
/*

This file is generated from async/transactionalReadWriteAsync.ts

*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionalQuery = exports.transactionalReadWrite = void 0;
const retry_1 = require("./retry");
// Similar to FoundationDb's abstraction: https://apple.github.io/foundationdb/class-scheduling.html
// Accepts a transaction or a database and allows you to compose transactions together.
// This outer function is just used for the schema type because currying is the only way
// we can partially infer generic type parameters.
// https://stackoverflow.com/questions/60377365/typescript-infer-type-of-generic-after-optional-first-generic
function transactionalReadWrite(retries = 5) {
    return function (fn) {
        return function (dbOrTx, ...args) {
            if (!("transact" in dbOrTx))
                return fn(dbOrTx, ...args);
            return (0, retry_1.retry)(retries, () => {
                const tx = dbOrTx.transact();
                const result = fn(tx, ...args);
                tx.commit();
                return result;
            });
        };
    };
}
exports.transactionalReadWrite = transactionalReadWrite;
/** @deprecated */
exports.transactionalQuery = transactionalReadWrite;
//# sourceMappingURL=../../../src/database/sync/transactionalReadWrite.js.map