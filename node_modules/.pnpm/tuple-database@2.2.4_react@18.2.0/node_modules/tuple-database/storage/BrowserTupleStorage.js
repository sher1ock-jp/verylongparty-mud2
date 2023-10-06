"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserTupleStorage = void 0;
const InMemoryTupleStorage_1 = require("./InMemoryTupleStorage");
function load(key) {
    const result = localStorage.getItem(key);
    if (!result)
        return;
    try {
        return JSON.parse(result);
    }
    catch (error) { }
}
function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
class BrowserTupleStorage extends InMemoryTupleStorage_1.InMemoryTupleStorage {
    constructor(localStorageKey) {
        super(load(localStorageKey));
        this.localStorageKey = localStorageKey;
    }
    commit(writes) {
        super.commit(writes);
        save(this.localStorageKey, this.data);
    }
}
exports.BrowserTupleStorage = BrowserTupleStorage;
//# sourceMappingURL=../../src/storage/BrowserTupleStorage.js.map