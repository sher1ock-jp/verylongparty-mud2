"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.QueryBuilder = exports.QueryResult = void 0;
class QueryResult {
    constructor(ops = []) {
        this.ops = ops;
        this.map = (fn) => {
            return new QueryResult([...this.ops, { fn: "map", args: [fn] }]);
        };
        this.chain = (fn) => {
            return new QueryResult([...this.ops, { fn: "chain", args: [fn] }]);
        };
    }
}
exports.QueryResult = QueryResult;
class QueryBuilder {
    constructor(ops = []) {
        this.ops = ops;
        this.subspace = (prefix) => {
            return new QueryBuilder([...this.ops, { fn: "subspace", args: [prefix] }]);
        };
        this.scan = (args) => {
            return new QueryResult([...this.ops, { fn: "scan", args: [args] }]);
        };
        this.write = (writes) => {
            return new QueryResult([...this.ops, { fn: "write", args: [writes] }]);
        };
    }
}
exports.QueryBuilder = QueryBuilder;
function execute(dbOrTx, query) {
    let tx = dbOrTx;
    const isTx = "set" in dbOrTx;
    if (!isTx) {
        tx = dbOrTx.transact();
    }
    let x = tx;
    for (const op of query.ops) {
        if (op.fn === "subspace") {
            x = x.subspace(...op.args);
        }
        if (op.fn === "scan") {
            x = x.scan(...op.args);
        }
        if (op.fn === "write") {
            x = x.write(...op.args);
        }
        if (op.fn === "map") {
            if (x instanceof Promise) {
                x = x.then((x) => op.args[0](x));
            }
            else {
                x = op.args[0](x);
            }
        }
        if (op.fn === "chain") {
            if (x instanceof Promise) {
                x = x.then((x) => execute(tx, op.args[0](x)));
            }
            else {
                x = execute(tx, op.args[0](x));
            }
        }
    }
    if (!isTx) {
        if (x instanceof Promise) {
            x = x.then((x) => {
                tx.commit();
                return x;
            });
        }
        else {
            tx.commit();
        }
    }
    return x;
}
exports.execute = execute;
//# sourceMappingURL=../../src/helpers/queryBuilder.js.map