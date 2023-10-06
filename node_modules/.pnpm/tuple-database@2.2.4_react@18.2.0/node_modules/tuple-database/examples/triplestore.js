"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateQuery = exports.substituteBinding = exports.queryExpression = exports.$ = exports.Variable = exports.removeFact = exports.writeFact = void 0;
const transactionalReadWrite_1 = require("../database/sync/transactionalReadWrite");
exports.writeFact = (0, transactionalReadWrite_1.transactionalReadWrite)()((tx, fact) => {
    const [e, a, v] = fact;
    tx.set(["eav", e, a, v], null);
    tx.set(["ave", a, v, e], null);
    tx.set(["vea", v, e, a], null);
});
exports.removeFact = (0, transactionalReadWrite_1.transactionalReadWrite)()((tx, fact) => {
    const [e, a, v] = fact;
    tx.remove(["eav", e, a, v]);
    tx.remove(["ave", a, v, e]);
    tx.remove(["vea", v, e, a]);
});
class Variable {
    constructor(name) {
        this.name = name;
    }
}
exports.Variable = Variable;
// Just for dev UX.
function $(name) {
    return new Variable(name);
}
exports.$ = $;
// Evaluate an expression by scanning the appropriate index.
exports.queryExpression = (0, transactionalReadWrite_1.transactionalReadWrite)()((tx, expr) => {
    const [$e, $a, $v] = expr;
    if ($e instanceof Variable) {
        if ($a instanceof Variable) {
            if ($v instanceof Variable) {
                // ___
                return tx
                    .scan({ prefix: ["eav"] })
                    .map(({ key: [_eav, e, a, v] }) => ({
                    [$e.name]: e,
                    [$a.name]: a,
                    [$v.name]: v,
                }));
            }
            else {
                // __V
                return tx
                    .scan({ prefix: ["vea", $v] })
                    .map(({ key: [_vea, _v, e, a] }) => ({
                    [$e.name]: e,
                    [$a.name]: a,
                }));
            }
        }
        else {
            if ($v instanceof Variable) {
                // A__
                return tx
                    .scan({ prefix: ["ave", $a] })
                    .map(({ key: [_ave, _a, v, e] }) => ({
                    [$e.name]: e,
                    [$v.name]: v,
                }));
            }
            else {
                // A_V
                return tx
                    .scan({ prefix: ["ave", $a, $v] })
                    .map(({ key: [_ave, _a, _v, e] }) => ({
                    [$e.name]: e,
                }));
            }
        }
    }
    else {
        if ($a instanceof Variable) {
            if ($v instanceof Variable) {
                // E__
                return tx
                    .scan({ prefix: ["eav", $e] })
                    .map(({ key: [_eav, _e, a, v] }) => ({
                    [$a.name]: a,
                    [$v.name]: v,
                }));
            }
            else {
                // E_V
                return tx
                    .scan({ prefix: ["vea", $v, $e] })
                    .map(({ key: [_vea, _v, _e, a] }) => ({
                    [$a.name]: a,
                }));
            }
        }
        else {
            if ($v instanceof Variable) {
                // EA_
                return tx
                    .scan({ prefix: ["eav", $e, $a] })
                    .map(({ key: [_eav, _e, _a, v] }) => ({
                    [$v.name]: v,
                }));
            }
            else {
                // EAV
                return tx
                    .scan({ prefix: ["eav", $e, $a, $v] })
                    .map(({ key: [_eav, _e, _a, _v] }) => ({}));
            }
        }
    }
});
function substituteBinding(query, binding) {
    return query.map((expr) => {
        return expr.map((item) => item instanceof Variable && item.name in binding
            ? binding[item.name]
            : item);
    });
}
exports.substituteBinding = substituteBinding;
// Recursively evaluate a query.
exports.evaluateQuery = (0, transactionalReadWrite_1.transactionalReadWrite)()((tx, query) => {
    const [first, ...rest] = query;
    if (rest.length === 0)
        return (0, exports.queryExpression)(tx, first);
    const bindings = (0, exports.queryExpression)(tx, first);
    const result = bindings
        .map((binding) => {
        // Substitute the rest of the variables for any bindings.
        const restQuery = substituteBinding(rest, binding);
        // Recursively evaluate
        const moreBindings = (0, exports.evaluateQuery)(tx, restQuery);
        // Join the results
        return moreBindings.map((b) => ({ ...b, ...binding }));
    })
        // Flatten the arrays
        .reduce((acc, next) => acc.concat(next), []);
    return result;
});
//# sourceMappingURL=../../src/examples/triplestore.js.map