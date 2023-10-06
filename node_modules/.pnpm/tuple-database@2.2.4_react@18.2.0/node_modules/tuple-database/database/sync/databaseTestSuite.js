"use strict";
/*

This file is generated from async/asyncDatabaseTestSuite.ts

*/
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
exports.databaseTestSuite = void 0;
const assert_1 = require("assert");
const _ = __importStar(require("lodash"));
const lodash_1 = require("lodash");
const mocha_1 = require("mocha");
const randomId_1 = require("../../helpers/randomId");
const types_1 = require("../../storage/types");
const assertHelpers_1 = require("../../test/assertHelpers");
const fixtures_1 = require("../../test/fixtures");
const transactionalWrite_1 = require("../transactionalWrite");
const subscribeQuery_1 = require("./subscribeQuery");
const transactionalReadWrite_1 = require("./transactionalReadWrite");
const isSync = true;
function databaseTestSuite(name, createStorage, durable = true) {
    (0, mocha_1.describe)(name, () => {
        (0, mocha_1.it)("inserts in correct order", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const items = [
                { key: ["a", "a", "a"], value: 1 },
                { key: ["a", "a", "b"], value: 2 },
                { key: ["a", "a", "c"], value: 3 },
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ];
            const transaction = store.transact();
            for (const { key, value } of _.shuffle(items)) {
                transaction.set(key, value);
            }
            transaction.commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data, items);
        });
        (0, mocha_1.it)("inserting the same thing gets deduplicated", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const transaction = store.transact();
            transaction.set(["a", "a"], 0);
            transaction.set(["a", "a"], 0);
            transaction.commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data, [{ key: ["a", "a"], value: 0 }]);
        });
        (0, mocha_1.it)("updates will overwrite the value", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const transaction = store.transact();
            transaction.set(["a", "a"], 0);
            transaction.set(["a", "a"], 1);
            transaction.commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data, [{ key: ["a", "a"], value: 1 }]);
        });
        (0, mocha_1.it)("transaction value overwrites works", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const transaction = store.transact();
            transaction.set(["a", "a"], 0);
            transaction.commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data, [{ key: ["a", "a"], value: 0 }]);
            const transaction2 = store.transact();
            transaction2.set(["a", "a"], 1);
            const data2 = transaction2.scan();
            (0, assertHelpers_1.assertEqual)(data2, [{ key: ["a", "a"], value: 1 }]);
            transaction2.commit();
            const data3 = store.scan();
            (0, assertHelpers_1.assertEqual)(data3, [{ key: ["a", "a"], value: 1 }]);
        });
        (0, mocha_1.it)("tx.scan limit and removes items correctly", () => {
            const store = createStorage((0, randomId_1.randomId)());
            store.commit({
                set: [
                    { key: [1], value: null },
                    { key: [2], value: null },
                    { key: [3], value: null },
                ],
            });
            const transaction = store.transact();
            transaction.remove([1]);
            transaction.remove([2]);
            const dataNoLimit = transaction.scan();
            (0, assertHelpers_1.assertEqual)(dataNoLimit, [{ key: [3], value: null }]);
            const data = transaction.scan({ limit: 1 });
            (0, assertHelpers_1.assertEqual)(data, [{ key: [3], value: null }]);
        });
        (0, mocha_1.it)("inserts the same thing gets deduplicated with ids", () => {
            const store = createStorage((0, randomId_1.randomId)());
            store
                .transact()
                .set(["a", { uuid: "a" }], 0)
                .set(["a", { uuid: "a" }], 0)
                .commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data.length, 1);
        });
        (0, mocha_1.it)("inserts get deduplicated in separate transactions", () => {
            const store = createStorage((0, randomId_1.randomId)());
            store
                .transact()
                .set(["a", { uuid: "a" }], 0)
                .commit();
            store
                .transact()
                .set(["a", { uuid: "a" }], 0)
                .commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data.length, 1);
        });
        (0, mocha_1.it)("inserts get deduplicated set/remove in same transaction", () => {
            const store = createStorage((0, randomId_1.randomId)());
            store
                .transact()
                .set(["a", { uuid: "a" }], 0)
                .remove(["a", { uuid: "a" }])
                .commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data.length, 0, `data: ${JSON.stringify(data)}`);
        });
        (0, mocha_1.it)("inserts get deduplicated remove/set in same transaction", () => {
            const store = createStorage((0, randomId_1.randomId)());
            store
                .transact()
                .remove(["a", { uuid: "a" }])
                .set(["a", { uuid: "a" }], 0)
                .commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data.length, 1);
        });
        (0, mocha_1.it)("inserts get deduplicated set/remove in same transaction with initial tuple", () => {
            const store = createStorage((0, randomId_1.randomId)());
            store
                .transact()
                .set(["a", { uuid: "a" }], 0)
                .commit();
            store
                .transact()
                .set(["a", { uuid: "a" }], 1)
                .remove(["a", { uuid: "a" }])
                .commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data.length, 0);
        });
        (0, mocha_1.it)("inserts get deduplicated remove/set in same transaction with initial tuple", () => {
            const store = createStorage((0, randomId_1.randomId)());
            store
                .transact()
                .set(["a", { uuid: "a" }], 0)
                .commit();
            store
                .transact()
                .remove(["a", { uuid: "a" }])
                .set(["a", { uuid: "a" }], 1)
                .commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data.length, 1);
        });
        (0, mocha_1.it)("removes items correctly", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const items = [
                { key: ["a", "a", "a"], value: 1 },
                { key: ["a", "a", "b"], value: 2 },
                { key: ["a", "a", "c"], value: 3 },
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ];
            const transaction = store.transact();
            for (const { key, value } of _.shuffle(items)) {
                transaction.set(key, value);
            }
            (0, assertHelpers_1.assertEqual)(transaction.scan(), items);
            transaction.remove(["a", "a", "c"]);
            transaction.remove(["a", "c", "a"]);
            transaction.remove(["a", "b", "b"]);
            const data = transaction.scan();
            (0, assertHelpers_1.assertEqual)(data, [
                { key: ["a", "a", "a"], value: 1 },
                { key: ["a", "a", "b"], value: 2 },
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ]);
            transaction.commit();
            (0, assertHelpers_1.assertEqual)(store.scan(), data);
        });
        (0, mocha_1.it)("transaction.write()", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const items = [
                { key: ["a", "a", "a"], value: 1 },
                { key: ["a", "a", "b"], value: 2 },
                { key: ["a", "a", "c"], value: 3 },
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ];
            store.transact().write({ set: items }).commit();
            let data = store.scan();
            (0, assertHelpers_1.assertEqual)(data, items);
            store
                .transact()
                .write({
                remove: [
                    ["a", "b", "a"],
                    ["a", "b", "b"],
                    ["a", "b", "c"],
                ],
            })
                .commit();
            data = store.scan();
            (0, assertHelpers_1.assertEqual)(data, [
                { key: ["a", "a", "a"], value: 1 },
                { key: ["a", "a", "b"], value: 2 },
                { key: ["a", "a", "c"], value: 3 },
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ]);
        });
        (0, mocha_1.it)("scan gt", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const items = [
                { key: ["a", "a", "a"], value: 1 },
                { key: ["a", "a", "b"], value: 2 },
                { key: ["a", "a", "c"], value: 3 },
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ];
            const transaction = store.transact();
            for (const { key, value } of _.shuffle(items)) {
                transaction.set(key, value);
            }
            transaction.commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data, items);
            const result = store.scan({
                gt: ["a", "a", types_1.MAX],
            });
            (0, assertHelpers_1.assertEqual)(result, [
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ]);
        });
        (0, mocha_1.it)("scan gt/lt", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const items = [
                { key: ["a", "a", "a"], value: 1 },
                { key: ["a", "a", "b"], value: 2 },
                { key: ["a", "a", "c"], value: 3 },
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ];
            const transaction = store.transact();
            for (const { key, value } of _.shuffle(items)) {
                transaction.set(key, value);
            }
            transaction.commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data, items);
            const result = store.scan({
                gt: ["a", "a", types_1.MAX],
                lt: ["a", "c", types_1.MIN],
            });
            (0, assertHelpers_1.assertEqual)(result, [
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
            ]);
            const result2 = store.scan({
                gt: ["a", "b", types_1.MIN],
                lt: ["a", "b", types_1.MAX],
            });
            (0, assertHelpers_1.assertEqual)(result2, [
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
            ]);
        });
        (0, mocha_1.it)("scan prefix", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const items = [
                { key: ["a", "a", "a"], value: 1 },
                { key: ["a", "a", "b"], value: 2 },
                { key: ["a", "a", "c"], value: 3 },
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ];
            const transaction = store.transact();
            for (const { key, value } of _.shuffle(items)) {
                transaction.set(key, value);
            }
            transaction.commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data, items);
            const result = store.scan({
                prefix: ["a", "b"],
            });
            (0, assertHelpers_1.assertEqual)(result, [
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
            ]);
        });
        (0, mocha_1.it)("scan prefix - issue with MAX being true", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const items = [
                { key: [2, true], value: 1 },
                { key: [2, true, 1], value: 1 },
                { key: [2, true, true], value: 1 },
                { key: [2, true, true, 1], value: 1 },
                { key: [2, true, true, true], value: 1 },
                { key: [2, true, true, true, 1], value: 1 },
            ];
            const transaction = store.transact();
            for (const { key, value } of _.shuffle(items)) {
                transaction.set(key, value);
            }
            transaction.commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data, items);
            const result = store.scan({ prefix: [2] });
            (0, assertHelpers_1.assertEqual)(result, items);
        });
        (0, mocha_1.it)("scan prefix gte/lte", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const items = [
                { key: ["a", "a", "a"], value: 1 },
                { key: ["a", "a", "b"], value: 2 },
                { key: ["a", "a", "c"], value: 3 },
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "b", "d"], value: 6.5 },
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ];
            const transaction = store.transact();
            for (const { key, value } of _.shuffle(items)) {
                transaction.set(key, value);
            }
            transaction.commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data, items);
            const result = store.scan({
                prefix: ["a", "b"],
                gte: ["b"],
                lte: ["d"],
            });
            (0, assertHelpers_1.assertEqual)(result, [
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "b", "d"], value: 6.5 },
            ]);
        });
        (0, mocha_1.it)("Scan args types work.", () => {
            const db = createStorage((0, randomId_1.randomId)());
            db.subspace(["aveo"]).scan({ gte: ["title"] });
        });
        (0, mocha_1.it)("scan prefix gte/lte with schema types", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const items = [
                { key: ["a", "a", "a"], value: 1 },
                { key: ["a", "a", "b"], value: 2 },
                { key: ["a", "a", "c"], value: 3 },
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "b", "d"], value: 6.5 },
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ];
            const transaction = store.transact();
            for (const { key, value } of _.shuffle(items)) {
                transaction.set(key, value);
            }
            transaction.commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data, items);
            const result = store.scan({
                prefix: ["a", "b"],
                gte: ["b"],
                lte: ["d"],
            });
            (0, assertHelpers_1.assertEqual)(result, [
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "b", "d"], value: 6.5 },
            ]);
        });
        (0, mocha_1.it)("scan gte", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const items = [
                { key: ["a", "a", "a"], value: 1 },
                { key: ["a", "a", "b"], value: 2 },
                { key: ["a", "a", "c"], value: 3 },
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ];
            const transaction = store.transact();
            for (const { key, value } of _.shuffle(items)) {
                transaction.set(key, value);
            }
            transaction.commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data, items);
            const result = store.scan({
                gte: ["a", "b", "a"],
            });
            (0, assertHelpers_1.assertEqual)(result, [
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ]);
        });
        (0, mocha_1.it)("scan gte/lte", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const items = [
                { key: ["a", "a", "a"], value: 1 },
                { key: ["a", "a", "b"], value: 2 },
                { key: ["a", "a", "c"], value: 3 },
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ];
            const transaction = store.transact();
            for (const { key, value } of _.shuffle(items)) {
                transaction.set(key, value);
            }
            transaction.commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data, items);
            const result = store.scan({
                gte: ["a", "a", "c"],
                lte: ["a", "c", types_1.MAX],
            });
            (0, assertHelpers_1.assertEqual)(result, [
                { key: ["a", "a", "c"], value: 3 },
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ]);
        });
        (0, mocha_1.it)("scan gte/lte with schema types", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const items = [
                { key: ["a", "a", "a"], value: 1 },
                { key: ["a", "a", "b"], value: 2 },
                { key: ["a", "a", "c"], value: 3 },
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ];
            const transaction = store.transact();
            for (const { key, value } of _.shuffle(items)) {
                transaction.set(key, value);
            }
            transaction.commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data, items);
            const result = store.scan({
                gte: ["a", "a", "c"],
                lte: ["a", "c", types_1.MAX],
            });
            (0, assertHelpers_1.assertEqual)(result, [
                { key: ["a", "a", "c"], value: 3 },
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ]);
        });
        (0, mocha_1.it)("scan sorted gt", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const items = [
                { key: ["a", "a", "a"], value: 1 },
                { key: ["a", "a", "b"], value: 2 },
                { key: ["a", "a", "c"], value: 3 },
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ];
            const transaction = store.transact();
            for (const { key, value } of _.shuffle(items)) {
                transaction.set(key, value);
            }
            transaction.commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data, items);
            const result = store.scan({
                gt: ["a", "b", types_1.MAX],
            });
            (0, assertHelpers_1.assertEqual)(result, [
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ]);
        });
        (0, mocha_1.it)("scan sorted gt/lt", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const items = [
                { key: ["a", "a", "a"], value: 1 },
                { key: ["a", "a", "b"], value: 2 },
                { key: ["a", "a", "c"], value: 3 },
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ];
            const transaction = store.transact();
            for (const { key, value } of _.shuffle(items)) {
                transaction.set(key, value);
            }
            transaction.commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data, items);
            const result = store.scan({
                gt: ["a", "a", types_1.MAX],
                lt: ["a", "b", types_1.MAX],
            });
            (0, assertHelpers_1.assertEqual)(result, [
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
            ]);
        });
        (0, mocha_1.it)("scan sorted gte", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const items = [
                { key: ["a", "a", "a"], value: 1 },
                { key: ["a", "a", "b"], value: 2 },
                { key: ["a", "a", "c"], value: 3 },
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ];
            const transaction = store.transact();
            for (const { key, value } of _.shuffle(items)) {
                transaction.set(key, value);
            }
            transaction.commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data, items);
            const result = store.scan({
                gte: ["a", "b", types_1.MIN],
            });
            (0, assertHelpers_1.assertEqual)(result, [
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ]);
        });
        (0, mocha_1.it)("scan sorted gte/lte", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const items = [
                { key: ["a", "a", "a"], value: 1 },
                { key: ["a", "a", "b"], value: 2 },
                { key: ["a", "a", "c"], value: 3 },
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ];
            const transaction = store.transact();
            for (const { key, value } of _.shuffle(items)) {
                transaction.set(key, value);
            }
            transaction.commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data, items);
            const result = store.scan({
                gte: ["a", "a", "c"],
                lte: ["a", "b", types_1.MAX],
            });
            (0, assertHelpers_1.assertEqual)(result, [
                { key: ["a", "a", "c"], value: 3 },
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
            ]);
        });
        (0, mocha_1.it)("scan invalid bounds", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const items = [
                { key: ["a", "a", "a"], value: 1 },
                { key: ["a", "a", "b"], value: 2 },
                { key: ["a", "a", "c"], value: 3 },
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ];
            const transaction = store.transact();
            for (const { key, value } of _.shuffle(items)) {
                transaction.set(key, value);
            }
            transaction.commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data, items);
            try {
                store.scan({
                    gte: ["a", "c"],
                    lte: ["a", "a"],
                });
                assert_1.strict.fail("Should fail.");
            }
            catch (error) {
                assert_1.strict.ok(error);
            }
        });
        (0, mocha_1.it)("stores all types of values", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const items = fixtures_1.sortedValues.map((item, i) => ({ key: [item], value: i }));
            const transaction = store.transact();
            for (const { key, value } of _.shuffle(items)) {
                transaction.set(key, value);
            }
            transaction.commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data, items);
        });
        (0, mocha_1.it)("transaction overwrites when scanning data out", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const items = [
                { key: ["a", "a", "a"], value: 1 },
                { key: ["a", "a", "b"], value: 2 },
                { key: ["a", "a", "c"], value: 3 },
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ];
            const transaction = store.transact();
            for (const { key, value } of _.shuffle(items)) {
                transaction.set(key, value);
            }
            transaction.commit();
            const data = store.scan();
            (0, assertHelpers_1.assertEqual)(data, items);
            const result = store.scan({ prefix: ["a", "b"] });
            (0, assertHelpers_1.assertEqual)(result, [
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
            ]);
            const transaction2 = store.transact();
            transaction2.set(["a", "b", "b"], 99);
            const result2 = transaction2.scan({ prefix: ["a", "b"] });
            (0, assertHelpers_1.assertEqual)(result2, [
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 99 },
                { key: ["a", "b", "c"], value: 6 },
            ]);
        });
        (0, mocha_1.it)("get", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const items = [
                { key: ["a", "a", "a"], value: 1 },
                { key: ["a", "a", "b"], value: 2 },
                { key: ["a", "a", "c"], value: 3 },
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ];
            const transaction = store.transact();
            for (const { key, value } of _.shuffle(items)) {
                transaction.set(key, value);
            }
            transaction.commit();
            (0, assertHelpers_1.assertEqual)(store.get(["a", "a", "c"]), 3);
            (0, assertHelpers_1.assertEqual)(store.get(["a", "c", "c"]), 9);
            (0, assertHelpers_1.assertEqual)(store.get(["a", "c", "d"]), undefined);
        });
        (0, mocha_1.it)("transaction overwrites get", () => {
            const store = createStorage((0, randomId_1.randomId)());
            store.transact().set(["a"], 1).set(["b"], 2).set(["c"], 3).commit();
            const tr = store.transact();
            tr.set(["a"], 2);
            (0, assertHelpers_1.assertEqual)(store.get(["a"]), 1);
            (0, assertHelpers_1.assertEqual)(tr.get(["a"]), 2);
            tr.remove(["b"]);
            (0, assertHelpers_1.assertEqual)(store.get(["b"]), 2);
            (0, assertHelpers_1.assertEqual)(tr.get(["b"]), undefined);
            tr.set(["d"], 99);
            (0, assertHelpers_1.assertEqual)(store.get(["d"]), undefined);
            (0, assertHelpers_1.assertEqual)(tr.get(["d"]), 99);
        });
        (0, mocha_1.it)("exists", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const items = [
                { key: ["a", "a", "a"], value: 1 },
                { key: ["a", "a", "b"], value: 2 },
                { key: ["a", "a", "c"], value: 3 },
                { key: ["a", "b", "a"], value: 4 },
                { key: ["a", "b", "b"], value: 5 },
                { key: ["a", "b", "c"], value: 6 },
                { key: ["a", "c", "a"], value: 7 },
                { key: ["a", "c", "b"], value: 8 },
                { key: ["a", "c", "c"], value: 9 },
            ];
            const transaction = store.transact();
            for (const { key, value } of _.shuffle(items)) {
                transaction.set(key, value);
            }
            transaction.commit();
            (0, assertHelpers_1.assertEqual)(store.exists(["a", "a", "c"]), true);
            (0, assertHelpers_1.assertEqual)(store.exists(["a", "c", "c"]), true);
            (0, assertHelpers_1.assertEqual)(store.exists(["a", "c", "d"]), false);
        });
        (0, mocha_1.it)("transaction overwrites exists", () => {
            const store = createStorage((0, randomId_1.randomId)());
            store.transact().set(["a"], 1).set(["b"], 2).set(["c"], 3).commit();
            const tr = store.transact();
            tr.set(["a"], 2);
            (0, assertHelpers_1.assertEqual)(store.exists(["a"]), true);
            (0, assertHelpers_1.assertEqual)(tr.exists(["a"]), true);
            tr.remove(["b"]);
            (0, assertHelpers_1.assertEqual)(store.exists(["b"]), true);
            (0, assertHelpers_1.assertEqual)(tr.exists(["b"]), false);
            tr.set(["d"], 99);
            (0, assertHelpers_1.assertEqual)(store.exists(["d"]), false);
            (0, assertHelpers_1.assertEqual)(tr.exists(["d"]), true);
        });
        (0, mocha_1.it)("committing a transaction prevents any further interaction", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const tx = store.transact();
            tx.commit();
            assert_1.strict.throws(() => tx.get([1]));
            assert_1.strict.throws(() => tx.exists([1]));
            assert_1.strict.throws(() => tx.scan());
            assert_1.strict.throws(() => tx.write({}));
            assert_1.strict.throws(() => tx.set([1], 2));
            assert_1.strict.throws(() => tx.remove([1]));
            assert_1.strict.throws(() => tx.cancel());
            assert_1.strict.throws(() => tx.commit());
        });
        (0, mocha_1.it)("canceling a transaction prevents any further interaction", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const tx = store.transact();
            tx.cancel();
            assert_1.strict.throws(() => tx.get([1]));
            assert_1.strict.throws(() => tx.exists([1]));
            assert_1.strict.throws(() => tx.scan());
            assert_1.strict.throws(() => tx.write({}));
            assert_1.strict.throws(() => tx.set([1], 2));
            assert_1.strict.throws(() => tx.remove([1]));
            assert_1.strict.throws(() => tx.cancel());
            assert_1.strict.throws(() => tx.commit());
        });
        (0, mocha_1.it)("cancelling a transaction does not submit writes", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const tx = store.transact();
            tx.set([1], 2);
            (0, assertHelpers_1.assertEqual)(tx.get([1]), 2);
            tx.cancel();
            (0, assertHelpers_1.assertEqual)(store.get([1]), undefined);
        });
        (0, mocha_1.it)("root transaction can be recomposed", () => {
            const store = createStorage((0, randomId_1.randomId)());
            const tx = store.transact();
            tx.set([1], 2);
            const tx2 = store.transact(tx.id, tx.writes);
            tx2.commit();
            (0, assertHelpers_1.assertEqual)(store.scan(), [{ key: [1], value: 2 }]);
        });
        mocha_1.it.skip("cancelled transaction cannot conflict with other transactions");
        (0, mocha_1.describe)("application-level indexing", () => {
            (0, mocha_1.it)("bidirectional friends stored as keys", () => {
                const store = createStorage((0, randomId_1.randomId)());
                function setAEV([a, e, v], tx) {
                    tx.set([a, e, v], null);
                    if (a === "friend")
                        tx.set([a, v, e], null);
                }
                function removeAEV([a, e, v], tx) {
                    tx.remove([a, e, v]);
                    if (a === "friend")
                        tx.remove([a, v, e]);
                }
                const items = [
                    ["friend", "a", "b"],
                    ["friend", "a", "c"],
                    ["friend", "b", "c"],
                    ["name", "a", "Chet"],
                    ["name", "b", "Meghan"],
                    ["name", "c", "Andrew"],
                ];
                const transaction = store.transact();
                for (const key of _.shuffle(items)) {
                    setAEV(key, transaction);
                }
                transaction.commit();
                let result = store.scan().map(({ key }) => key);
                (0, assertHelpers_1.assertEqual)(result, [
                    ["friend", "a", "b"],
                    ["friend", "a", "c"],
                    ["friend", "b", "a"],
                    ["friend", "b", "c"],
                    ["friend", "c", "a"],
                    ["friend", "c", "b"],
                    ["name", "a", "Chet"],
                    ["name", "b", "Meghan"],
                    ["name", "c", "Andrew"],
                ]);
                const tx = store.transact();
                removeAEV(["friend", "a", "b"], tx);
                result = tx.scan().map(({ key }) => key);
                (0, assertHelpers_1.assertEqual)(result, [
                    ["friend", "a", "c"],
                    ["friend", "b", "c"],
                    ["friend", "c", "a"],
                    ["friend", "c", "b"],
                    ["name", "a", "Chet"],
                    ["name", "b", "Meghan"],
                    ["name", "c", "Andrew"],
                ]);
                setAEV(["friend", "d", "a"], tx);
                result = tx.scan().map(({ key }) => key);
                (0, assertHelpers_1.assertEqual)(result, [
                    ["friend", "a", "c"],
                    ["friend", "a", "d"],
                    ["friend", "b", "c"],
                    ["friend", "c", "a"],
                    ["friend", "c", "b"],
                    ["friend", "d", "a"],
                    ["name", "a", "Chet"],
                    ["name", "b", "Meghan"],
                    ["name", "c", "Andrew"],
                ]);
            });
            (0, mocha_1.it)("indexing objects stored as values", () => {
                const store = createStorage((0, randomId_1.randomId)());
                function setPerson(person, tx) {
                    const prev = tx.get(["personById", person.id]);
                    if (prev) {
                        tx.remove(["personByAge", prev.age, prev.id]);
                    }
                    tx.set(["personById", person.id], person);
                    tx.set(["personByAge", person.age, person.id], person);
                }
                function removePerson(personId, tx) {
                    const prev = tx.get(["personById", personId]);
                    if (prev) {
                        tx.remove(["personByAge", prev.age, prev.id]);
                        tx.remove(["personById", prev.id]);
                    }
                }
                const people = [
                    { id: 1, first: "Chet", last: "Corcos", age: 29 },
                    { id: 2, first: "Simon", last: "Last", age: 26 },
                    { id: 3, first: "Jon", last: "Schwartz", age: 30 },
                    { id: 4, first: "Luke", last: "Hansen", age: 29 },
                ];
                const transaction = store.transact();
                for (const person of _.shuffle(people)) {
                    setPerson(person, transaction);
                }
                transaction.commit();
                let result = store.scan().map(({ key }) => key);
                (0, assertHelpers_1.assertEqual)(result, [
                    ["personByAge", 26, 2],
                    ["personByAge", 29, 1],
                    ["personByAge", 29, 4],
                    ["personByAge", 30, 3],
                    ["personById", 1],
                    ["personById", 2],
                    ["personById", 3],
                    ["personById", 4],
                ]);
                const tx = store.transact();
                removePerson(3, tx);
                result = tx.scan().map(({ key }) => key);
                (0, assertHelpers_1.assertEqual)(result, [
                    ["personByAge", 26, 2],
                    ["personByAge", 29, 1],
                    ["personByAge", 29, 4],
                    ["personById", 1],
                    ["personById", 2],
                    ["personById", 4],
                ]);
                setPerson({
                    id: 1,
                    first: "Chet",
                    last: "Corcos",
                    age: 30,
                }, tx);
                result = tx.scan().map(({ key }) => key);
                (0, assertHelpers_1.assertEqual)(result, [
                    ["personByAge", 26, 2],
                    ["personByAge", 29, 4],
                    ["personByAge", 30, 1],
                    ["personById", 1],
                    ["personById", 2],
                    ["personById", 4],
                ]);
            });
        });
        (0, mocha_1.describe)("MVCC - Multi-version Concurrency Control", () => {
            // Basically, concurrent transactional read-writes.
            (0, mocha_1.it)("works", () => {
                const id = (0, randomId_1.randomId)();
                const store = createStorage(id);
                // The lamp is off
                store.commit({ set: [{ key: ["lamp"], value: false }] });
                // Chet wants the lamp on, Meghan wants the lamp off.
                const chet = store.transact();
                const meghan = store.transact();
                // Chet turns it on if its off.
                if (!chet.get(["lamp"]))
                    chet.set(["lamp"], true);
                // Meghan turns it off if its on.
                if (meghan.get(["lamp"]))
                    meghan.set(["lamp"], false);
                // Someone has to lose. Whoever commits first wins.
                chet.commit();
                assert_1.strict.throws(() => meghan.commit());
                (0, assertHelpers_1.assertEqual)(store.get(["lamp"]), true);
                // Meghan will have to try again.
                const meghan2 = store.transact();
                if (meghan2.get(["lamp"]))
                    meghan2.set(["lamp"], false);
                meghan2.commit();
                // And she has her way.
                (0, assertHelpers_1.assertEqual)(store.get(["lamp"]), false);
            });
            if (!isSync) {
                (0, mocha_1.it)("transactionalQuery will retry on those errors", () => {
                    const id = (0, randomId_1.randomId)();
                    const store = createStorage(id);
                    store.commit({ set: [{ key: ["score"], value: 0 }] });
                    const sleep = (timeMs) => new Promise((resolve) => setTimeout(resolve, timeMs));
                    const incScore = (0, transactionalReadWrite_1.transactionalReadWrite)()((tx, amount, sleepMs) => {
                        const score = tx.get(["score"]);
                        sleep(sleepMs);
                        tx.set(["score"], score + amount);
                    });
                    // 0 -> chet reads
                    // 1 -> meghan reads
                    // 2 -> chet writes
                    // 3 -> meghan writes -- conflict!
                    // 3 -> meghan reads -- retry
                    // 4 -> meghan writes -- success!
                    function chet() {
                        incScore(store, 10, 2);
                        (0, assertHelpers_1.assertEqual)(store.get(["score"]), 10);
                    }
                    function meghan() {
                        sleep(1);
                        incScore(store, -1, 2);
                        (0, assertHelpers_1.assertEqual)(store.get(["score"]), 9);
                    }
                    ;
                    [chet(), meghan()];
                    // Final state.
                    (0, assertHelpers_1.assertEqual)(store.get(["score"]), 9);
                });
            }
            (0, mocha_1.it)("should probably generalize to scans as well", () => {
                const id = (0, randomId_1.randomId)();
                const store = createStorage(id);
                store.commit({
                    set: [
                        // TODO: add test using value as well.
                        { key: ["player", "chet", 0], value: null },
                        { key: ["player", "meghan", 0], value: null },
                        { key: ["total", 0], value: null },
                    ],
                });
                // We have a score keeping game.
                const addScore = (0, transactionalReadWrite_1.transactionalReadWrite)()((tx, player, inc) => {
                    // It has this miserable api, lol.
                    const getPlayerScore = (player) => {
                        const pairs = tx.scan({ prefix: ["player", player] });
                        if (pairs.length !== 1)
                            throw new Error("Missing player.");
                        const [{ key }] = pairs;
                        return key[2];
                    };
                    const getCurrentTotal = () => {
                        const totals = tx.scan({ prefix: ["total"] });
                        if (totals.length !== 1)
                            throw new Error("Too many totals.");
                        const [{ key }] = totals;
                        return key[1];
                    };
                    const resetTotal = () => {
                        const pairs = tx.scan({ prefix: ["player"] });
                        const total = (0, lodash_1.sum)(pairs.map(({ key }) => key[2]));
                        tx.remove(["total", getCurrentTotal()]);
                        tx.set(["total", total], null);
                    };
                    // But crucially, we reset the whole total whenever someone scores.
                    const playerScore = getPlayerScore(player);
                    tx.remove(["player", player, playerScore]);
                    tx.set(["player", player, playerScore + inc], null);
                    resetTotal();
                });
                // Chet an meghan are playing a game.
                const chet = store.transact();
                const meghan = store.transact();
                // Chet
                addScore(chet, "chet", 1);
                addScore(meghan, "meghan", 1);
                // Whoever commits first will win.
                meghan.commit();
                assert_1.strict.throws(() => chet.commit());
                // Most importantly, the total will never be incorrect.
                (0, assertHelpers_1.assertEqual)(store.scan({ prefix: [] }), [
                    { key: ["player", "chet", 0], value: null },
                    { key: ["player", "meghan", 1], value: null },
                    { key: ["total", 1], value: null },
                ]);
            });
            (0, mocha_1.it)("computes granular conflict based on tuple bounds, not prefix", () => {
                const id = (0, randomId_1.randomId)();
                const store = createStorage(id);
                const a = store.transact();
                const b = store.transact();
                a.scan({ gte: [1], lt: [10] });
                b.scan({ gte: [10] });
                const c = store.transact();
                c.set([10], null);
                c.commit();
                a.commit(); // ok
                assert_1.strict.throws(() => b.commit());
            });
            mocha_1.it.skip("can be used for transactional reads");
        });
        (0, mocha_1.describe)("Reactivity", () => {
            (0, mocha_1.it)("works with setting a value on existing key", () => {
                const store = createStorage((0, randomId_1.randomId)());
                store.commit({
                    set: [{ key: ["a"], value: 1 }],
                });
                let hoist;
                store.subscribe({ gte: ["a"], lte: ["a"] }, (writes) => {
                    hoist = writes;
                });
                store.transact().set(["a"], 1).commit();
                assert_1.strict.deepStrictEqual(hoist, {
                    set: [{ key: ["a"], value: 1 }],
                    remove: [],
                });
            });
            (0, mocha_1.it)("works with set key", () => {
                const store = createStorage((0, randomId_1.randomId)());
                const items = [
                    { key: ["a", "a", "a"], value: 1 },
                    { key: ["a", "a", "b"], value: 2 },
                    { key: ["a", "a", "c"], value: 3 },
                    { key: ["a", "b", "a"], value: 4 },
                    { key: ["a", "b", "b"], value: 5 },
                    { key: ["a", "b", "c"], value: 6 },
                    { key: ["a", "c", "a"], value: 7 },
                    { key: ["a", "c", "b"], value: 8 },
                    { key: ["a", "c", "c"], value: 9 },
                ];
                const transaction = store.transact();
                for (const { key, value } of _.shuffle(items)) {
                    transaction.set(key, value);
                }
                transaction.commit();
                const data = store.scan();
                (0, assertHelpers_1.assertEqual)(data, items);
                let hoist;
                store.subscribe({ gt: ["a", "a", types_1.MAX], lt: ["a", "c", types_1.MIN] }, (writes) => {
                    hoist = writes;
                });
                store.transact().set(["a", "b", 1], 1).commit();
                assert_1.strict.deepStrictEqual(hoist, {
                    set: [{ key: ["a", "b", 1], value: 1 }],
                    remove: [],
                });
            });
            (0, mocha_1.it)("works with remove key", () => {
                const store = createStorage((0, randomId_1.randomId)());
                const items = [
                    { key: ["a", "a", "a"], value: 1 },
                    { key: ["a", "a", "b"], value: 2 },
                    { key: ["a", "a", "c"], value: 3 },
                    { key: ["a", "b", "a"], value: 4 },
                    { key: ["a", "b", "b"], value: 5 },
                    { key: ["a", "b", "c"], value: 6 },
                    { key: ["a", "c", "a"], value: 7 },
                    { key: ["a", "c", "b"], value: 8 },
                    { key: ["a", "c", "c"], value: 9 },
                ];
                const transaction = store.transact();
                for (const { key, value } of _.shuffle(items)) {
                    transaction.set(key, value);
                }
                transaction.commit();
                const data = store.scan();
                (0, assertHelpers_1.assertEqual)(data, items);
                let hoist;
                store.subscribe({ prefix: ["a", "b"] }, (writes) => {
                    hoist = writes;
                });
                store.transact().remove(["a", "b", "a"]).commit();
                assert_1.strict.deepStrictEqual(hoist, {
                    set: [],
                    remove: [["a", "b", "a"]],
                });
            });
            (0, mocha_1.it)("works when overwriting a value to an existing key", () => {
                const store = createStorage((0, randomId_1.randomId)());
                const items = [
                    { key: ["a", "a", "a"], value: 1 },
                    { key: ["a", "a", "b"], value: 2 },
                    { key: ["a", "a", "c"], value: 3 },
                    { key: ["a", "b", "a"], value: 4 },
                    { key: ["a", "b", "b"], value: 5 },
                    { key: ["a", "b", "c"], value: 6 },
                    { key: ["a", "c", "a"], value: 7 },
                    { key: ["a", "c", "b"], value: 8 },
                    { key: ["a", "c", "c"], value: 9 },
                ];
                const transaction = store.transact();
                for (const { key, value } of _.shuffle(items)) {
                    transaction.set(key, value);
                }
                transaction.commit();
                const data = store.scan();
                (0, assertHelpers_1.assertEqual)(data, items);
                let hoist;
                store.subscribe({ prefix: ["a", "b"] }, (writes) => {
                    hoist = writes;
                });
                store.transact().set(["a", "b", "a"], 99).commit();
                assert_1.strict.deepStrictEqual(hoist, {
                    set: [{ key: ["a", "b", "a"], value: 99 }],
                    remove: [],
                });
            });
            (0, mocha_1.it)("should use prefix correctly and filter bounds", () => {
                const store = createStorage((0, randomId_1.randomId)());
                const items = [
                    { key: ["a", "a", "a"], value: 1 },
                    { key: ["a", "a", "b"], value: 2 },
                    { key: ["a", "a", "c"], value: 3 },
                    { key: ["a", "b", "a"], value: 4 },
                    { key: ["a", "b", "b"], value: 5 },
                    { key: ["a", "b", "c"], value: 6 },
                    { key: ["a", "c", "a"], value: 7 },
                    { key: ["a", "c", "b"], value: 8 },
                    { key: ["a", "c", "c"], value: 9 },
                ];
                const transaction = store.transact();
                for (const { key, value } of _.shuffle(items)) {
                    transaction.set(key, value);
                }
                transaction.commit();
                const data = store.scan();
                (0, assertHelpers_1.assertEqual)(data, items);
                // Note that these queries are *basically* the same.
                // { gt: ["a", "a", MAX], lt: ["a", "c", MIN] },
                // { gt: ["a", "b", MIN], lt: ["a", "b", MAX] },
                // But the second one has better reactivity performance due to the shared prefix.
                let hoist1;
                store.subscribe({ gt: ["a", "b", types_1.MIN], lt: ["a", "b", types_1.MAX] }, (writes) => {
                    hoist1 = writes;
                });
                let hoist2;
                store.subscribe({ gt: ["a", "a", types_1.MAX], lt: ["a", "c", types_1.MIN] }, (writes) => {
                    hoist2 = writes;
                });
                let hoist3;
                store.subscribe({ gt: ["a", "a", types_1.MAX], lt: ["a", "c", types_1.MAX] }, (writes) => {
                    hoist3 = writes;
                });
                store.transact().set(["a", "c", 1], 1).commit();
                assert_1.strict.deepStrictEqual(hoist1, undefined);
                // Even though the prefix matches, isWithinBounds should filter this out.
                assert_1.strict.deepStrictEqual(hoist2, undefined);
                assert_1.strict.deepStrictEqual(hoist3, {
                    set: [{ key: ["a", "c", 1], value: 1 }],
                    remove: [],
                });
            });
            (0, mocha_1.it)("waits for emit callbacks before resolving commit", () => {
                const store = createStorage((0, randomId_1.randomId)());
                store.commit({ set: [{ key: ["a"], value: 1 }] });
                let value = store.get(["a"]);
                assert_1.strict.equal(value, 1);
                store.subscribe({ gte: ["a"], lte: ["a"] }, (writes) => {
                    value = store.get(["a"]);
                });
                store.transact().set(["a"], 2).commit();
                assert_1.strict.equal(value, 2);
            });
            (0, mocha_1.it)("errors in callbacks don't break the database", () => {
                const store = createStorage((0, randomId_1.randomId)());
                store.subscribe({ prefix: ["a"] }, () => {
                    throw new Error();
                });
                // Does not throw, calls console.error instead.
                store.transact().set(["a", 1], 1).commit();
            });
            mocha_1.it.skip("No writing inside an emit", () => {
                const store = createStorage((0, randomId_1.randomId)());
                let called = false;
                let throws = false;
                store.subscribe({ prefix: ["a"] }, () => {
                    called = true;
                    try {
                        store.commit({ set: [{ key: ["b"], value: 2 }] });
                    }
                    catch (error) {
                        throws = true;
                    }
                });
                // Does not throw, calls console.error instead.
                store.transact().set(["a", 1], 1).commit();
                assert_1.strict.equal(called, true);
                assert_1.strict.equal(throws, true);
            });
        });
        (0, mocha_1.describe)("subscribeQuery", () => {
            (0, mocha_1.it)("works", () => {
                const store = createStorage((0, randomId_1.randomId)());
                store.commit({
                    set: [
                        { key: ["person", 1], value: "chet" },
                        { key: ["person", 2], value: "meghan" },
                        { key: ["person", 3], value: "sean" },
                        { key: ["list", 0, 1], value: null },
                        { key: ["list", 1, 2], value: null },
                    ],
                });
                let compute = 0;
                let peopleList = [];
                const { result, destroy } = (0, subscribeQuery_1.subscribeQuery)(store, (db) => {
                    compute++;
                    const pairs = db.scan({ prefix: ["list"] });
                    const people = pairs.map(({ key }) => db.get(["person", key[2]]));
                    return people;
                }, (newResult) => {
                    peopleList = newResult;
                });
                peopleList = result;
                assert_1.strict.deepEqual(peopleList, ["chet", "meghan"]);
                assert_1.strict.deepEqual(compute, 1);
                compute = 0;
                store.transact().set(["person", 1], "chester").commit();
                assert_1.strict.deepEqual(peopleList, ["chester", "meghan"]);
                assert_1.strict.deepEqual(compute, 1);
                compute = 0;
                store.transact().set(["person", 3], "joe").commit();
                assert_1.strict.deepEqual(peopleList, ["chester", "meghan"]);
                assert_1.strict.deepEqual(compute, 0);
                // Two changes at once, only one callback.
                store
                    .transact()
                    .set(["person", 2], "mego")
                    .set(["person", 1], "chet")
                    .remove(["list", 0, 1])
                    .set(["list", 2, 1], null)
                    .commit();
                assert_1.strict.deepEqual(peopleList, ["mego", "chet"]);
                assert_1.strict.deepEqual(compute, 1);
            });
            (0, mocha_1.it)("can transactionally read", () => {
                const id = (0, randomId_1.randomId)();
                const store = createStorage(id);
                store.commit({
                    set: [
                        { key: ["chet"], value: 1 },
                        { key: ["meghan"], value: 1 },
                    ],
                });
                const getTotal = (0, transactionalReadWrite_1.transactionalReadWrite)()((tx) => {
                    const chet = tx.get(["chet"]);
                    const meghan = tx.get(["meghan"]);
                    return chet + meghan;
                });
                let total;
                const { result, destroy } = (0, subscribeQuery_1.subscribeQuery)(store, (db) => getTotal(db), (result) => {
                    total = result;
                });
                total = result;
                assert_1.strict.equal(total, 2);
                store.commit({
                    set: [
                        { key: ["chet"], value: 2 },
                        { key: ["meghan"], value: 2 },
                    ],
                });
                assert_1.strict.equal(total, 4);
                store.transact().set(["chet"], 3).commit();
                assert_1.strict.equal(total, 5);
            });
        });
        (0, mocha_1.describe)("subspace", () => {
            (0, mocha_1.it)("get/exists/scan works", () => {
                const store = createStorage((0, randomId_1.randomId)());
                const writePerson = (0, transactionalReadWrite_1.transactionalReadWrite)()((tx, person) => {
                    tx.set(["person", person.id], person);
                    tx.set(["personByName", person.name, person.id], person);
                    tx.set(["personByAge", person.age, person.id], person);
                });
                writePerson(store, { id: "1", name: "Chet", age: 31 });
                writePerson(store, { id: "2", name: "Meghan", age: 30 });
                writePerson(store, { id: "3", name: "Tanishq", age: 22 });
                const personByAge = store.subspace(["personByAge"]);
                (0, assertHelpers_1.assertEqual)(personByAge.scan().map(({ key }) => key[0]), [22, 30, 31]);
                (0, assertHelpers_1.assertEqual)(personByAge.get([22, "3"]).name, "Tanishq");
                (0, assertHelpers_1.assertEqual)(personByAge.exists([31, "1"]), true);
                (0, assertHelpers_1.assertEqual)(personByAge.exists([31, "2"]), false);
            });
            (0, mocha_1.it)("writes work", () => {
                const store = createStorage((0, randomId_1.randomId)());
                store.commit({
                    set: [
                        { key: ["a", 1], value: 1 },
                        { key: ["a", 2], value: 2 },
                    ],
                });
                const a = store.subspace(["a"]);
                const tx = a.transact().set([3], 3);
                (0, assertHelpers_1.assertEqual)(tx.get([1]), 1);
                (0, assertHelpers_1.assertEqual)(tx.get([3]), 3);
                tx.commit();
                (0, assertHelpers_1.assertEqual)(a.scan(), [
                    { key: [1], value: 1 },
                    { key: [2], value: 2 },
                    { key: [3], value: 3 },
                ]);
            });
            (0, mocha_1.it)("writes work in a nested subspace", () => {
                const store = createStorage((0, randomId_1.randomId)());
                store.commit({
                    set: [
                        { key: ["a", "a", 1], value: 1 },
                        { key: ["a", "a", 2], value: 2 },
                    ],
                });
                const a = store.subspace(["a"]);
                const aa = a.subspace(["a"]);
                const tx = aa.transact().set([3], 3);
                (0, assertHelpers_1.assertEqual)(tx.get([1]), 1);
                (0, assertHelpers_1.assertEqual)(tx.get([3]), 3);
                tx.commit();
                (0, assertHelpers_1.assertEqual)(aa.scan(), [
                    { key: [1], value: 1 },
                    { key: [2], value: 2 },
                    { key: [3], value: 3 },
                ]);
            });
            (0, mocha_1.it)("can create nested subspace inside a transaction", () => {
                const store = createStorage((0, randomId_1.randomId)());
                store.commit({
                    set: [
                        { key: ["a", "a", 1], value: 1 },
                        { key: ["a", "a", 2], value: 2 },
                    ],
                });
                const a = store.subspace(["a"]);
                const tx = a.transact();
                tx.set(["a", 3], 3);
                const aa = tx.subspace(["a"]);
                aa.set([4], 4);
                (0, assertHelpers_1.assertEqual)(aa.scan(), [
                    { key: [1], value: 1 },
                    { key: [2], value: 2 },
                    { key: [3], value: 3 },
                    { key: [4], value: 4 },
                ]);
                tx.commit();
                (0, assertHelpers_1.assertEqual)(a.scan(), [
                    { key: ["a", 1], value: 1 },
                    { key: ["a", 2], value: 2 },
                    { key: ["a", 3], value: 3 },
                    { key: ["a", 4], value: 4 },
                ]);
            });
            (0, mocha_1.it)("root tuple transaction API conforms to non-root transaction api.", () => {
                const store = createStorage((0, randomId_1.randomId)());
                function f(tx) { }
                const tx = store.transact();
                f(tx);
                f(tx.subspace([]));
            });
            (0, mocha_1.it)("scan args types work", () => {
                const store = createStorage((0, randomId_1.randomId)());
                store.commit({
                    set: [
                        { key: ["a", 1], value: 1 },
                        { key: ["a", 2], value: 2 },
                    ],
                });
                const a = store.subspace(["a"]);
                (0, assertHelpers_1.assertEqual)(a.scan({ gt: [1] }), [{ key: [2], value: 2 }]);
            });
        });
        (0, mocha_1.describe)("subschema", () => {
            (0, mocha_1.it)("types work", () => {
                const store = createStorage((0, randomId_1.randomId)());
                function module0(db) {
                    const a1 = () => db.get(["a", 1]);
                    const a2 = () => db.get(["b", ""]);
                    const a3 = () => db.scan({ prefix: ["a"] });
                    const a4 = () => db.scan({ prefix: ["b"] });
                    const a5 = () => db.scan({ prefix: [] });
                    const a6 = () => db.subspace(["a"]);
                    const a7 = () => db.subspace(["b"]);
                    const a8 = () => db.transact();
                }
                function module1(db) {
                    const a1 = () => db.get(["a", 1]);
                    const a3 = () => db.scan({ prefix: ["a"] });
                    // TODO: this is leaky! Maybe its best to use subspaces!
                    const a5 = () => db.scan({ prefix: [] });
                    const a6 = () => db.subspace(["a"]);
                    const a8 = () => db.transact();
                }
                function module2(db) {
                    const a2 = () => db.get(["b", ""]);
                    const a4 = () => db.scan({ prefix: ["b"] });
                    const a5 = () => db.scan({ prefix: [] });
                    const a7 = () => db.subspace(["b"]);
                }
                module0(store);
                // @ts-expect-error
                module1(store);
                // @ts-expect-error
                module2(store);
            });
            (0, mocha_1.it)("types work", () => {
                const store = createStorage((0, randomId_1.randomId)());
                function module1(db) { }
                function module2(db) { }
                // @ts-expect-error
                module1(store);
                // @ts-expect-error
                module2(store);
            });
        });
        if (durable) {
            (0, mocha_1.describe)("Persistence", () => {
                (0, mocha_1.it)("persists properly", () => {
                    const id = (0, randomId_1.randomId)();
                    const store = createStorage(id);
                    const items = [
                        { key: ["a", "a", "a"], value: 1 },
                        { key: ["a", "a", "b"], value: 2 },
                        { key: ["a", "a", "c"], value: 3 },
                        { key: ["a", "b", "a"], value: 4 },
                        { key: ["a", "b", "b"], value: 5 },
                        { key: ["a", "b", "c"], value: 6 },
                        { key: ["a", "c", "a"], value: 7 },
                        { key: ["a", "c", "b"], value: 8 },
                        { key: ["a", "c", "c"], value: 9 },
                    ];
                    const transaction = store.transact();
                    for (const { key, value } of _.shuffle(items)) {
                        transaction.set(key, value);
                    }
                    transaction.commit();
                    const data = store.scan();
                    (0, assertHelpers_1.assertEqual)(data, items);
                    store.close();
                    const store2 = createStorage(id);
                    const data2 = store2.scan();
                    (0, assertHelpers_1.assertEqual)(data2, items);
                });
            });
        }
        (0, mocha_1.it)("scan reverse", () => {
            const db = createStorage((0, randomId_1.randomId)());
            db.commit({
                set: [
                    { key: [1], value: null },
                    { key: [2], value: null },
                    { key: [3], value: null },
                ],
            });
            (0, assertHelpers_1.assertEqual)(db.scan({ reverse: true }), [
                { key: [3], value: null },
                { key: [2], value: null },
                { key: [1], value: null },
            ]);
        });
        (0, mocha_1.it)("scan limit", () => {
            const db = createStorage((0, randomId_1.randomId)());
            db.commit({
                set: [
                    { key: [1], value: null },
                    { key: [2], value: null },
                    { key: [3], value: null },
                ],
            });
            (0, assertHelpers_1.assertEqual)(db.scan({ limit: 1 }), [{ key: [1], value: null }]);
        });
        (0, mocha_1.it)("scan reverse limit", () => {
            const db = createStorage((0, randomId_1.randomId)());
            db.commit({
                set: [
                    { key: [1], value: null },
                    { key: [2], value: null },
                    { key: [3], value: null },
                ],
            });
            (0, assertHelpers_1.assertEqual)(db.scan({ reverse: true, limit: 1 }), [
                { key: [3], value: null },
            ]);
        });
        (0, mocha_1.it)("tx.scan reverse with pending write", () => {
            const db = createStorage((0, randomId_1.randomId)());
            db.commit({
                set: [
                    { key: [1], value: null },
                    { key: [2], value: null },
                    { key: [3], value: null },
                ],
            });
            const tx = db.transact();
            tx.set([2.5], null);
            (0, assertHelpers_1.assertEqual)(tx.scan({ reverse: true }), [
                { key: [3], value: null },
                { key: [2.5], value: null },
                { key: [2], value: null },
                { key: [1], value: null },
            ]);
        });
        (0, mocha_1.it)("tx.scan limit", () => {
            const db = createStorage((0, randomId_1.randomId)());
            db.commit({
                set: [
                    { key: [1], value: null },
                    { key: [2], value: null },
                    { key: [3], value: null },
                ],
            });
            NoChange: {
                const tx = db.transact();
                tx.set([5], null);
                (0, assertHelpers_1.assertEqual)(tx.scan({ limit: 1 }), [{ key: [1], value: null }]);
            }
            YesChange: {
                const tx = db.transact();
                tx.set([0], null);
                (0, assertHelpers_1.assertEqual)(tx.scan({ limit: 1 }), [{ key: [0], value: null }]);
            }
        });
        (0, mocha_1.it)("tx.scan limit reverse", () => {
            const db = createStorage((0, randomId_1.randomId)());
            db.commit({
                set: [
                    { key: [1], value: null },
                    { key: [2], value: null },
                    { key: [3], value: null },
                ],
            });
            YesChange: {
                const tx = db.transact();
                tx.set([5], null);
                (0, assertHelpers_1.assertEqual)(tx.scan({ limit: 1, reverse: true }), [
                    { key: [5], value: null },
                ]);
            }
            NoChange: {
                const tx = db.transact();
                tx.set([0], null);
                (0, assertHelpers_1.assertEqual)(tx.scan({ limit: 1, reverse: true }), [
                    { key: [3], value: null },
                ]);
            }
        });
        (0, mocha_1.it)("tx.scan limit 2", () => {
            const db = createStorage((0, randomId_1.randomId)());
            db.commit({
                set: [
                    { key: [1], value: null },
                    { key: [2], value: null },
                    { key: [3], value: null },
                ],
            });
            YesChange: {
                const tx = db.transact();
                tx.set([0], null);
                (0, assertHelpers_1.assertEqual)(tx.scan({ limit: 2 }), [
                    { key: [0], value: null },
                    { key: [1], value: null },
                ]);
            }
            NoChange: {
                const tx = db.transact();
                tx.set([5], null);
                (0, assertHelpers_1.assertEqual)(tx.scan({ limit: 2 }), [
                    { key: [1], value: null },
                    { key: [2], value: null },
                ]);
            }
        });
        (0, mocha_1.describe)("transactionalWrite", () => {
            (0, mocha_1.it)("Works for both  and sync, but no reads.", () => {
                const id = (0, randomId_1.randomId)();
                const store = createStorage(id);
                const resetScore = (0, transactionalWrite_1.transactionalWrite)()((tx) => {
                    tx.set(["score"], 0);
                });
                resetScore(store);
            });
        });
        // New tests here...
    });
}
exports.databaseTestSuite = databaseTestSuite;
//# sourceMappingURL=../../../src/database/sync/databaseTestSuite.js.map