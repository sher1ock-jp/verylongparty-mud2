"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
class Queue {
    enqueue(fn) {
        if (this.currentPromise) {
            const nextPromise = this.currentPromise.then(fn).then((result) => {
                if (this.currentPromise === nextPromise)
                    this.currentPromise = undefined;
                return result;
            });
            this.currentPromise = nextPromise;
            return nextPromise;
        }
        const result = fn();
        if (result instanceof Promise) {
            const nextPromise = result.then((result) => {
                if (this.currentPromise === nextPromise)
                    this.currentPromise = undefined;
                return result;
            });
            this.currentPromise = nextPromise;
            return nextPromise;
        }
        return result;
    }
}
exports.Queue = Queue;
//# sourceMappingURL=../../src/helpers/Queue.js.map