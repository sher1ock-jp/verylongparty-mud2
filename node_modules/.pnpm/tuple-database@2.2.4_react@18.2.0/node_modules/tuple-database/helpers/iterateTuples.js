"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWrittenTuples = exports.iterateWrittenTuples = void 0;
function* iterateWrittenTuples(write) {
    for (const { key } of write.set || []) {
        yield key;
    }
    for (const tuple of write.remove || []) {
        yield tuple;
    }
}
exports.iterateWrittenTuples = iterateWrittenTuples;
function getWrittenTuples(write) {
    return Array.from(iterateWrittenTuples(write));
}
exports.getWrittenTuples = getWrittenTuples;
//# sourceMappingURL=../../src/helpers/iterateTuples.js.map