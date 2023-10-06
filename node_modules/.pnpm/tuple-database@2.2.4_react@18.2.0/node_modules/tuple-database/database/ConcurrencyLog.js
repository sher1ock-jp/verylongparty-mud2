"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcurrencyLog = exports.ReadWriteConflictError = void 0;
const mutableFilter_1 = require("../helpers/mutableFilter");
const outdent_1 = require("../helpers/outdent");
const sortedTupleArray_1 = require("../helpers/sortedTupleArray");
class ReadWriteConflictError extends Error {
    constructor(txId, writeTuple, readBounds) {
        const message = (0, outdent_1.outdent)(`
      ReadWriteConflictError: ${txId}
      Write to tuple ${writeTuple}
      conflicted with a read at the bounds ${readBounds}
    `);
        super(message);
    }
}
exports.ReadWriteConflictError = ReadWriteConflictError;
class ConcurrencyLog {
    constructor() {
        // O(n) refers to this.log.length
        this.log = [];
    }
    // O(1)
    /** Record a read. */
    read(txId, bounds) {
        this.log.push({ type: "read", txId, bounds });
    }
    // O(n)
    /** Add writes to the log only if there is a conflict with a read. */
    write(txId, tuple) {
        for (const item of this.log) {
            if (item.type === "read" && (0, sortedTupleArray_1.isTupleWithinBounds)(tuple, item.bounds)) {
                this.log.push({ type: "write", tuple, txId });
                break;
            }
        }
    }
    // O(n^2/4)
    /** Determine if any reads conflict with writes. */
    commit(txId) {
        try {
            const reads = [];
            for (const item of this.log) {
                if (item.type === "read") {
                    if (item.txId === txId) {
                        reads.push(item.bounds);
                    }
                }
                else if (item.type === "write") {
                    for (const read of reads) {
                        if ((0, sortedTupleArray_1.isTupleWithinBounds)(item.tuple, read)) {
                            throw new ReadWriteConflictError(item.txId, item.tuple, read);
                        }
                    }
                }
            }
        }
        finally {
            this.cleanupReads(txId);
            this.cleanupWrites();
        }
    }
    cancel(txId) {
        this.cleanupReads(txId);
        this.cleanupWrites();
    }
    // O(n)
    /** Cleanup any reads for this transaction. */
    cleanupReads(txId) {
        (0, mutableFilter_1.mutableFilter)(this.log, (item) => {
            const txRead = item.txId === txId && item.type === "read";
            return !txRead;
        });
    }
    // O(n)
    /** Cleanup any writes that don't have conflicting reads. */
    cleanupWrites() {
        const reads = [];
        (0, mutableFilter_1.mutableFilter)(this.log, (item) => {
            if (item.type === "read") {
                reads.push(item.bounds);
                return true;
            }
            else {
                for (const read of reads) {
                    if ((0, sortedTupleArray_1.isTupleWithinBounds)(item.tuple, read)) {
                        return true;
                    }
                }
                return false;
            }
        });
    }
}
exports.ConcurrencyLog = ConcurrencyLog;
//# sourceMappingURL=../../src/database/ConcurrencyLog.js.map