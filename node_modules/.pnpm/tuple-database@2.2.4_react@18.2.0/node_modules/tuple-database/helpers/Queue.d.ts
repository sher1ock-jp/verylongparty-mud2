export type Thunk<T> = () => Promise<T> | T;
export declare class Queue {
    private currentPromise;
    enqueue<T>(fn: Thunk<T>): Promise<T> | T;
}
//# sourceMappingURL=../../src/helpers/Queue.d.ts.map