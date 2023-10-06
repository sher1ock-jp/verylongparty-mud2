"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncTupleSubspaceTransaction = exports.AsyncTupleRootTransaction = exports.AsyncTupleDatabaseClient = void 0;
const randomId_1 = require("../../helpers/randomId");
const t = __importStar(require("../../helpers/sortedTupleArray"));
const tv = __importStar(require("../../helpers/sortedTupleValuePairs"));
const subspaceHelpers_1 = require("../../helpers/subspaceHelpers");
class AsyncTupleDatabaseClient {
    constructor(db, subspacePrefix = []) {
        this.db = db;
        this.subspacePrefix = subspacePrefix;
    }
    async scan(args = {}, txId) {
        const storageScanArgs = (0, subspaceHelpers_1.normalizeSubspaceScanArgs)(this.subspacePrefix, args);
        const pairs = await this.db.scan(storageScanArgs, txId);
        const result = (0, subspaceHelpers_1.removePrefixFromTupleValuePairs)(this.subspacePrefix, pairs);
        return result;
    }
    async subscribe(args, callback) {
        const storageScanArgs = (0, subspaceHelpers_1.normalizeSubspaceScanArgs)(this.subspacePrefix, args);
        return this.db.subscribe(storageScanArgs, (write, txId) => {
            return callback((0, subspaceHelpers_1.removePrefixFromWriteOps)(this.subspacePrefix, write), txId);
        });
    }
    async commit(writes, txId) {
        const prefixedWrites = (0, subspaceHelpers_1.prependPrefixToWriteOps)(this.subspacePrefix, writes);
        await this.db.commit(prefixedWrites, txId);
    }
    async cancel(txId) {
        return this.db.cancel(txId);
    }
    async get(tuple, txId) {
        // Not sure why these types aren't happy
        // @ts-ignore
        const items = await this.scan({ gte: tuple, lte: tuple }, txId);
        if (items.length === 0)
            return;
        if (items.length > 1)
            throw new Error("Get expects only one value.");
        const pair = items[0];
        return pair.value;
    }
    async exists(tuple, txId) {
        // Not sure why these types aren't happy
        // @ts-ignore
        const items = await this.scan({ gte: tuple, lte: tuple }, txId);
        if (items.length === 0)
            return false;
        return items.length >= 1;
    }
    // Subspace
    subspace(prefix) {
        const subspacePrefix = [...this.subspacePrefix, ...prefix];
        return new AsyncTupleDatabaseClient(this.db, subspacePrefix);
    }
    // Transaction
    transact(txId, writes) {
        const id = txId || (0, randomId_1.randomId)();
        return new AsyncTupleRootTransaction(this.db, this.subspacePrefix, id, writes);
    }
    async close() {
        return this.db.close();
    }
}
exports.AsyncTupleDatabaseClient = AsyncTupleDatabaseClient;
class AsyncTupleRootTransaction {
    constructor(db, subspacePrefix, id, writes) {
        this.db = db;
        this.subspacePrefix = subspacePrefix;
        this.id = id;
        this.committed = false;
        this.canceled = false;
        this.writes = { set: [], remove: [], ...writes };
    }
    checkActive() {
        if (this.committed)
            throw new Error("Transaction already committed");
        if (this.canceled)
            throw new Error("Transaction already canceled");
    }
    async scan(args = {}) {
        this.checkActive();
        const { limit: resultLimit, ...scanArgs } = (0, subspaceHelpers_1.normalizeSubspaceScanArgs)(this.subspacePrefix, args);
        // We don't want to include the limit in this scan.
        const sets = tv.scan(this.writes.set, scanArgs);
        const removes = t.scan(this.writes.remove, scanArgs);
        // If we've removed items from this range, then lets make sure to fetch enough
        // from storage for the final result limit.
        const scanLimit = resultLimit ? resultLimit + removes.length : undefined;
        const pairs = await this.db.scan({ ...scanArgs, limit: scanLimit }, this.id);
        const result = (0, subspaceHelpers_1.removePrefixFromTupleValuePairs)(this.subspacePrefix, pairs);
        for (const { key: fullTuple, value } of sets) {
            const tuple = (0, subspaceHelpers_1.removePrefixFromTuple)(this.subspacePrefix, fullTuple);
            // Make sure we insert in reverse if the scan is in reverse.
            tv.set(result, tuple, value, scanArgs.reverse);
        }
        for (const fullTuple of removes) {
            const tuple = (0, subspaceHelpers_1.removePrefixFromTuple)(this.subspacePrefix, fullTuple);
            tv.remove(result, tuple, scanArgs.reverse);
        }
        // Make sure to truncate the results if we added items to the result set.
        if (resultLimit) {
            if (result.length > resultLimit) {
                result.splice(resultLimit, result.length);
            }
        }
        return result;
    }
    async get(tuple) {
        this.checkActive();
        const fullTuple = (0, subspaceHelpers_1.prependPrefixToTuple)(this.subspacePrefix, tuple);
        if (tv.exists(this.writes.set, fullTuple)) {
            // TODO: binary searching twice unnecessarily...
            return tv.get(this.writes.set, fullTuple);
        }
        if (t.exists(this.writes.remove, fullTuple)) {
            return;
        }
        const items = await this.db.scan({ gte: fullTuple, lte: fullTuple }, this.id);
        if (items.length === 0)
            return;
        if (items.length > 1)
            throw new Error("Get expects only one value.");
        const pair = items[0];
        return pair.value;
    }
    async exists(tuple) {
        this.checkActive();
        const fullTuple = (0, subspaceHelpers_1.prependPrefixToTuple)(this.subspacePrefix, tuple);
        if (tv.exists(this.writes.set, fullTuple)) {
            return true;
        }
        if (t.exists(this.writes.remove, fullTuple)) {
            return false;
        }
        const items = await this.db.scan({ gte: fullTuple, lte: fullTuple }, this.id);
        if (items.length === 0)
            return false;
        return items.length >= 1;
    }
    // ReadApis
    set(tuple, value) {
        this.checkActive();
        const fullTuple = (0, subspaceHelpers_1.prependPrefixToTuple)(this.subspacePrefix, tuple);
        t.remove(this.writes.remove, fullTuple);
        tv.set(this.writes.set, fullTuple, value);
        return this;
    }
    remove(tuple) {
        this.checkActive();
        const fullTuple = (0, subspaceHelpers_1.prependPrefixToTuple)(this.subspacePrefix, tuple);
        tv.remove(this.writes.set, fullTuple);
        t.set(this.writes.remove, fullTuple);
        return this;
    }
    write(writes) {
        this.checkActive();
        // If you're calling this function, then the order of these opertions
        // shouldn't matter.
        const { set, remove } = writes;
        for (const tuple of remove || []) {
            this.remove(tuple);
        }
        for (const { key, value } of set || []) {
            this.set(key, value);
        }
        return this;
    }
    async commit() {
        this.checkActive();
        this.committed = true;
        return this.db.commit(this.writes, this.id);
    }
    async cancel() {
        this.checkActive();
        this.canceled = true;
        return this.db.cancel(this.id);
    }
    subspace(prefix) {
        this.checkActive();
        // TODO: types.
        return new AsyncTupleSubspaceTransaction(this, prefix);
    }
}
exports.AsyncTupleRootTransaction = AsyncTupleRootTransaction;
class AsyncTupleSubspaceTransaction {
    constructor(tx, subspacePrefix) {
        this.tx = tx;
        this.subspacePrefix = subspacePrefix;
    }
    async scan(args = {}) {
        const storageScanArgs = (0, subspaceHelpers_1.normalizeSubspaceScanArgs)(this.subspacePrefix, args);
        const pairs = await this.tx.scan(storageScanArgs);
        const result = (0, subspaceHelpers_1.removePrefixFromTupleValuePairs)(this.subspacePrefix, pairs);
        return result;
    }
    async get(tuple) {
        const fullTuple = (0, subspaceHelpers_1.prependPrefixToTuple)(this.subspacePrefix, tuple);
        return this.tx.get(fullTuple);
    }
    async exists(tuple) {
        const fullTuple = (0, subspaceHelpers_1.prependPrefixToTuple)(this.subspacePrefix, tuple);
        return this.tx.exists(fullTuple);
    }
    // ReadApis
    set(tuple, value) {
        const fullTuple = (0, subspaceHelpers_1.prependPrefixToTuple)(this.subspacePrefix, tuple);
        this.tx.set(fullTuple, value);
        return this;
    }
    remove(tuple) {
        const fullTuple = (0, subspaceHelpers_1.prependPrefixToTuple)(this.subspacePrefix, tuple);
        this.tx.remove(fullTuple);
        return this;
    }
    write(writes) {
        // If you're calling this function, then the order of these opertions
        // shouldn't matter.
        const { set, remove } = writes;
        for (const tuple of remove || []) {
            this.remove(tuple);
        }
        for (const { key, value } of set || []) {
            this.set(key, value);
        }
        return this;
    }
    subspace(prefix) {
        return new AsyncTupleSubspaceTransaction(this.tx, [
            ...this.subspacePrefix,
            ...prefix,
        ]);
    }
}
exports.AsyncTupleSubspaceTransaction = AsyncTupleSubspaceTransaction;
//# sourceMappingURL=../../../src/database/async/AsyncTupleDatabaseClient.js.map