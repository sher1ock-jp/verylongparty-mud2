"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeQueryAsync = void 0;
const isEmptyWrites_1 = require("../../helpers/isEmptyWrites");
const Queue_1 = require("../../helpers/Queue");
const AsyncTupleDatabaseClient_1 = require("./AsyncTupleDatabaseClient");
const throwError = () => {
    throw new Error();
};
async function subscribeQueryAsync(db, fn, callback) {
    let destroyed = false;
    const listeners = new Set();
    const compute = () => fn(listenDb);
    const resetListeners = () => {
        listeners.forEach((destroy) => destroy());
        listeners.clear();
    };
    let lastComputedTxId;
    const recompute = async (txId) => {
        if (destroyed)
            return;
        // Skip over duplicate emits.
        if (txId === lastComputedTxId)
            return;
        // Recompute.
        lastComputedTxId = txId;
        resetListeners();
        const result = await compute();
        callback(result);
    };
    const recomputeQueue = new Queue_1.Queue();
    // Subscribe for every scan that gets called.
    const listenDb = new AsyncTupleDatabaseClient_1.AsyncTupleDatabaseClient({
        scan: async (args, txId) => {
            // if (txId)
            // 	// Maybe one day we can transactionally subscribe to a bunch of things. But
            // 	// for now, lets just avoid that...
            // 	throw new Error("Not allowed to subscribe transactionally.")
            const destroy = await db.subscribe(args, async (_writes, txId) => recomputeQueue.enqueue(() => recompute(txId)));
            listeners.add(destroy);
            const results = await db.scan(args);
            return results;
        },
        cancel: async (txId) => {
            await db.cancel(txId);
        },
        commit: async (writes, txId) => {
            if (!(0, isEmptyWrites_1.isEmptyWrites)(writes))
                throw new Error("No writing in a subscribeQueryAsync.");
            // Commit to resolve conflicts with transactional reads.
            await db.commit({}, txId);
        },
        subscribe: throwError,
        close: throwError,
    });
    const result = await compute();
    const destroy = () => {
        resetListeners();
        destroyed = true;
    };
    return { result, destroy };
}
exports.subscribeQueryAsync = subscribeQueryAsync;
//# sourceMappingURL=../../../src/database/async/subscribeQueryAsync.js.map