"use strict";
/*

This file is generated from async/subscribeQueryAsync.ts

*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeQuery = void 0;
const isEmptyWrites_1 = require("../../helpers/isEmptyWrites");
const Queue_1 = require("../../helpers/Queue");
const TupleDatabaseClient_1 = require("./TupleDatabaseClient");
const throwError = () => {
    throw new Error();
};
function subscribeQuery(db, fn, callback) {
    let destroyed = false;
    const listeners = new Set();
    const compute = () => fn(listenDb);
    const resetListeners = () => {
        listeners.forEach((destroy) => destroy());
        listeners.clear();
    };
    let lastComputedTxId;
    const recompute = (txId) => {
        if (destroyed)
            return;
        // Skip over duplicate emits.
        if (txId === lastComputedTxId)
            return;
        // Recompute.
        lastComputedTxId = txId;
        resetListeners();
        const result = compute();
        callback(result);
    };
    const recomputeQueue = new Queue_1.Queue();
    // Subscribe for every scan that gets called.
    const listenDb = new TupleDatabaseClient_1.TupleDatabaseClient({
        scan: (args, txId) => {
            // if (txId)
            // 	// Maybe one day we can transactionally subscribe to a bunch of things. But
            // 	// for now, lets just avoid that...
            // 	throw new Error("Not allowed to subscribe transactionally.")
            const destroy = db.subscribe(args, (_writes, txId) => recomputeQueue.enqueue(() => recompute(txId)));
            listeners.add(destroy);
            const results = db.scan(args);
            return results;
        },
        cancel: (txId) => {
            db.cancel(txId);
        },
        commit: (writes, txId) => {
            if (!(0, isEmptyWrites_1.isEmptyWrites)(writes))
                throw new Error("No writing in a subscribeQuery.");
            // Commit to resolve conflicts with transactional reads.
            db.commit({}, txId);
        },
        subscribe: throwError,
        close: throwError,
    });
    const result = compute();
    const destroy = () => {
        resetListeners();
        destroyed = true;
    };
    return { result, destroy };
}
exports.subscribeQuery = subscribeQuery;
//# sourceMappingURL=../../../src/database/sync/subscribeQuery.js.map