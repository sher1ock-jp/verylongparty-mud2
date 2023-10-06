"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexedDbTupleStorage = void 0;
const with_async_ittr_1 = require("idb/with-async-ittr");
const codec_1 = require("../helpers/codec");
const version = 1;
const storeName = "tupledb";
class IndexedDbTupleStorage {
    constructor(dbName) {
        this.dbName = dbName;
        this.db = (0, with_async_ittr_1.openDB)(dbName, version, {
            upgrade(db) {
                db.createObjectStore(storeName);
            },
        });
    }
    async scan(args) {
        const db = await this.db;
        const tx = db.transaction(storeName, "readonly");
        const index = tx.store; // primary key
        const lower = (args === null || args === void 0 ? void 0 : args.gt) || (args === null || args === void 0 ? void 0 : args.gte);
        const lowerEq = Boolean(args === null || args === void 0 ? void 0 : args.gte);
        const upper = (args === null || args === void 0 ? void 0 : args.lt) || (args === null || args === void 0 ? void 0 : args.lte);
        const upperEq = Boolean(args === null || args === void 0 ? void 0 : args.lte);
        let range;
        if (upper) {
            if (lower) {
                range = IDBKeyRange.bound((0, codec_1.encodeTuple)(lower), (0, codec_1.encodeTuple)(upper), !lowerEq, !upperEq);
            }
            else {
                range = IDBKeyRange.upperBound((0, codec_1.encodeTuple)(upper), !upperEq);
            }
        }
        else {
            if (lower) {
                range = IDBKeyRange.lowerBound((0, codec_1.encodeTuple)(lower), !lowerEq);
            }
            else {
                range = null;
            }
        }
        const direction = (args === null || args === void 0 ? void 0 : args.reverse) ? "prev" : "next";
        const limit = (args === null || args === void 0 ? void 0 : args.limit) || Infinity;
        let results = [];
        for await (const cursor of index.iterate(range, direction)) {
            results.push({
                key: (0, codec_1.decodeTuple)(cursor.key),
                value: cursor.value,
            });
            if (results.length >= limit)
                break;
        }
        await tx.done;
        return results;
    }
    async commit(writes) {
        const db = await this.db;
        const tx = db.transaction(storeName, "readwrite");
        for (const { key, value } of writes.set || []) {
            tx.store.put(value, (0, codec_1.encodeTuple)(key));
        }
        for (const key of writes.remove || []) {
            tx.store.delete((0, codec_1.encodeTuple)(key));
        }
        await tx.done;
    }
    async close() {
        const db = await this.db;
        db.close();
    }
}
exports.IndexedDbTupleStorage = IndexedDbTupleStorage;
//# sourceMappingURL=../../src/storage/IndexedDbTupleStorage.js.map