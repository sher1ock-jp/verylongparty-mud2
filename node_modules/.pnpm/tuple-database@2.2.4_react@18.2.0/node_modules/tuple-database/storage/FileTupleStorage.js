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
exports.FileTupleStorage = exports.parseFile = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const InMemoryTupleStorage_1 = require("./InMemoryTupleStorage");
function parseFile(str) {
    if (str === "") {
        return [];
    }
    return str.split("\n").map((line) => {
        const pair = JSON.parse(line);
        // Backward compatibility with [key, value].
        if (Array.isArray(pair)) {
            const [key, value] = pair;
            return { key, value };
        }
        return pair;
    });
}
exports.parseFile = parseFile;
function serializeFile(data) {
    return data.map((pair) => JSON.stringify(pair)).join("\n");
}
class FileTupleStorage extends InMemoryTupleStorage_1.InMemoryTupleStorage {
    // This is pretty bonkers: https://github.com/Microsoft/TypeScript/issues/8277
    // @ts-ignore
    constructor(dbPath) {
        const cache = new FileCache(dbPath);
        super(cache.get());
        this.dbPath = dbPath;
        this.cache = cache;
    }
    commit(writes) {
        super.commit(writes);
        this.cache.set(this.data);
    }
}
exports.FileTupleStorage = FileTupleStorage;
class FileCache {
    constructor(dbPath) {
        this.dbPath = dbPath;
    }
    getFilePath() {
        return this.dbPath + ".txt";
    }
    get() {
        // Check that the file exists.
        const filePath = this.getFilePath();
        try {
            const stat = fs.statSync(filePath);
            if (!stat.isFile()) {
                throw new Error("Database is not a file.");
            }
        }
        catch (error) {
            if (error.code === "ENOENT") {
                // File does not exist.
                return [];
            }
            throw error;
        }
        const fileContents = fs.readFileSync(filePath, "utf8");
        const data = parseFile(fileContents);
        return data;
    }
    // TODO: throttle this call if it makes sense.
    set(data) {
        const filePath = this.getFilePath();
        const fileContents = serializeFile(data);
        fs.mkdirpSync(path.dirname(this.dbPath));
        fs.writeFileSync(filePath, fileContents, "utf8");
    }
}
//# sourceMappingURL=../../src/storage/FileTupleStorage.js.map