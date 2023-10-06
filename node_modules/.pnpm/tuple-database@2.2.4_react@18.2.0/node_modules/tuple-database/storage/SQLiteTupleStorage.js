"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLiteTupleStorage = void 0;
const codec_1 = require("../helpers/codec");
class SQLiteTupleStorage {
    /**
     * import sqlite from "better-sqlite3"
     * new SQLiteTupleStorage(sqlite("path/to.db"))
     */
    constructor(db) {
        this.db = db;
        this.scan = (args = {}) => {
            // Bounds.
            let start = args.gte ? (0, codec_1.encodeTuple)(args.gte) : undefined;
            let startAfter = args.gt
                ? (0, codec_1.encodeTuple)(args.gt)
                : undefined;
            let end = args.lte ? (0, codec_1.encodeTuple)(args.lte) : undefined;
            let endBefore = args.lt
                ? (0, codec_1.encodeTuple)(args.lt)
                : undefined;
            const sqlArgs = {
                start,
                startAfter,
                end,
                endBefore,
                limit: args.limit,
            };
            const where = [
                start ? "key >= $start" : undefined,
                startAfter ? "key > $startAfter" : undefined,
                end ? "key <= $end" : undefined,
                endBefore ? "key < $endBefore" : undefined,
            ]
                .filter(Boolean)
                .join(" and ");
            let sqlQuery = `select * from data`;
            if (where) {
                sqlQuery += " where ";
                sqlQuery += where;
            }
            sqlQuery += " order by key";
            if (args.reverse) {
                sqlQuery += " desc";
            }
            if (args.limit) {
                sqlQuery += ` limit $limit`;
            }
            const results = this.db.prepare(sqlQuery).all(sqlArgs);
            return results.map(({ key, value }) => ({
                key: (0, codec_1.decodeTuple)(key),
                value: JSON.parse(value),
            }));
        };
        this.commit = (writes) => {
            const { set: inserts, remove: deletes } = writes;
            this.writeFactsQuery({ inserts, deletes });
        };
        const createTableQuery = db.prepare(`create table if not exists data ( key text primary key, value text)`);
        // Make sure the table exists.
        createTableQuery.run();
        const insertQuery = db.prepare(`insert or replace into data values ($key, $value)`);
        const deleteQuery = db.prepare(`delete from data where key = $key`);
        this.writeFactsQuery = this.db.transaction(({ inserts, deletes, }) => {
            for (const { key, value } of inserts || []) {
                insertQuery.run({
                    key: (0, codec_1.encodeTuple)(key),
                    value: JSON.stringify(value),
                });
            }
            for (const tuple of deletes || []) {
                deleteQuery.run({ key: (0, codec_1.encodeTuple)(tuple) });
            }
        });
    }
    close() {
        this.db.close();
    }
}
exports.SQLiteTupleStorage = SQLiteTupleStorage;
//# sourceMappingURL=../../src/storage/SQLiteTupleStorage.js.map