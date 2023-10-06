"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelayDb = void 0;
function sleep(ms = 0) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
// Introduce delay into a database, mostly for debugging purposes.
function DelayDb(db, delay = 0) {
    return {
        scan: async (...args) => {
            await sleep(delay);
            return db.scan(...args);
        },
        commit: async (...args) => {
            await sleep(delay);
            return db.commit(...args);
        },
        cancel: async (...args) => {
            await sleep(delay);
            return db.cancel(...args);
        },
        subscribe: async (...args) => {
            await sleep(delay);
            return db.subscribe(...args);
        },
        close: async (...args) => {
            await sleep(delay);
            return db.close(...args);
        },
    };
}
exports.DelayDb = DelayDb;
//# sourceMappingURL=../../src/helpers/DelayDb.js.map