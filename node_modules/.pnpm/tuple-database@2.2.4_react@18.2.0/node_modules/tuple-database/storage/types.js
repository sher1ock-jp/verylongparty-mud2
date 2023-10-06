"use strict";
/*

Just basic JSON data-types. This is a pragmatic decision:
- If we have custom data types in here, we have to consider how to deserialize
    into different languages. For JavaScript, that means creating a class. But
    these classes don't serialize well over a JSON bridge between processes.
- The kind of data types we might want is endless. To start, I can think of
    {uuid: string}, {date: string} but then there's things like {url: string} or
    {phone: string} which dive deeper into application-level concepts.

So that is why this database layer only deals with JSON.

*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX = exports.MIN = void 0;
exports.MIN = null;
exports.MAX = true;
//# sourceMappingURL=../../src/storage/types.js.map