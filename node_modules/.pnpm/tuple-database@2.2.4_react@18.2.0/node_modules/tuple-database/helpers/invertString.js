"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invertString = void 0;
/**
 * This is helpful when you have a fixed-length string that you want to sort in reverse order.
 * For example, and ISO date string.
 */
function invertString(str) {
    return str
        .split("")
        .map((char) => String.fromCharCode(-1 * char.charCodeAt(0)))
        .join("");
}
exports.invertString = invertString;
//# sourceMappingURL=../../src/helpers/invertString.js.map