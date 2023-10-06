"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAsyncTupleDatabase = void 0;
const react_1 = require("react");
const shallowEqual_1 = require("./helpers/shallowEqual");
const main_1 = require("./main");
/** Useful for managing UI state for React with a TupleDatabase. */
function useAsyncTupleDatabase(db, fn, args) {
    const [result, setResult] = (0, react_1.useState)(undefined);
    (0, react_1.useEffect)(() => {
        let stopped = false;
        let stop;
        (0, main_1.subscribeQueryAsync)(db, (db) => fn(db, ...args), (newResult) => {
            if (stopped)
                return;
            if (!(0, shallowEqual_1.shallowEqual)(newResult, result)) {
                setResult(newResult);
            }
        }).then(({ result, destroy }) => {
            setResult(result);
            if (stopped)
                destroy();
            else
                stop = destroy;
        });
        return () => {
            stopped = true;
            if (stop)
                stop();
        };
    }, [db, fn, ...args]);
    return result;
}
exports.useAsyncTupleDatabase = useAsyncTupleDatabase;
//# sourceMappingURL=../src/useAsyncTupleDatabase.js.map