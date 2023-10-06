"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTupleDatabase = void 0;
const react_1 = require("react");
const subscribeQuery_1 = require("./database/sync/subscribeQuery");
const shallowEqual_1 = require("./helpers/shallowEqual");
const useRerender_1 = require("./helpers/useRerender");
/** Useful for managing UI state for React with a TupleDatabase. */
function useTupleDatabase(db, fn, args) {
    const rerender = (0, useRerender_1.useRerender)();
    const resultRef = (0, react_1.useRef)({});
    const destroy = (0, react_1.useMemo)(() => {
        const { result, destroy } = (0, subscribeQuery_1.subscribeQuery)(db, (db) => fn(db, ...args), (result) => {
            if (!(0, shallowEqual_1.shallowEqual)(resultRef.current, result)) {
                resultRef.current = result;
                rerender();
            }
        });
        resultRef.current = result;
        return destroy;
    }, [db, fn, ...args]);
    (0, react_1.useEffect)(() => {
        return destroy;
    }, [destroy]);
    return resultRef.current;
}
exports.useTupleDatabase = useTupleDatabase;
//# sourceMappingURL=../src/useTupleDatabase.js.map