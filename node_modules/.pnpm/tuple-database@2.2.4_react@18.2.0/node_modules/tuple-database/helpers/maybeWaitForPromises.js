"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maybePromiseAll = void 0;
function maybePromiseAll(values) {
    if (values.some((value) => value instanceof Promise))
        return Promise.all(values.map((value) => {
            // Gobble up errors.
            if (value instanceof Promise) {
                return value.catch((error) => console.error(error));
            }
            else {
                return value;
            }
        }));
    else
        return values;
}
exports.maybePromiseAll = maybePromiseAll;
//# sourceMappingURL=../../src/helpers/maybeWaitForPromises.js.map