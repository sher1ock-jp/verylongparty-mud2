"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelTupleStorage = void 0;
const codec_1 = require("../helpers/codec");
class LevelTupleStorage {
    /**
     * import level from "level"
     * new LevelTupleStorage(level("path/to.db"))
     */
    constructor(db) {
        this.db = db;
    }
    async scan(args = {}) {
        const dbArgs = {};
        if (args.gt !== undefined)
            dbArgs.gt = (0, codec_1.encodeTuple)(args.gt);
        if (args.gte !== undefined)
            dbArgs.gte = (0, codec_1.encodeTuple)(args.gte);
        if (args.lt !== undefined)
            dbArgs.lt = (0, codec_1.encodeTuple)(args.lt);
        if (args.lte !== undefined)
            dbArgs.lte = (0, codec_1.encodeTuple)(args.lte);
        if (args.limit !== undefined)
            dbArgs.limit = args.limit;
        if (args.reverse !== undefined)
            dbArgs.reverse = args.reverse;
        const results = [];
        for await (const [key, value] of this.db.iterator(dbArgs)) {
            results.push({
                key: (0, codec_1.decodeTuple)(key),
                value: (0, codec_1.decodeValue)(value),
            });
        }
        return results;
    }
    async commit(writes) {
        const ops = [
            ...(writes.remove || []).map((tuple) => ({
                type: "del",
                key: (0, codec_1.encodeTuple)(tuple),
            })),
            ...(writes.set || []).map(({ key, value }) => ({
                type: "put",
                key: (0, codec_1.encodeTuple)(key),
                value: (0, codec_1.encodeValue)(value),
            })),
        ];
        await this.db.batch(ops);
    }
    async close() {
        return this.db.close();
    }
}
exports.LevelTupleStorage = LevelTupleStorage;
//# sourceMappingURL=../../src/storage/LevelTupleStorage.js.map