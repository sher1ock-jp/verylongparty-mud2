"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outdent = void 0;
// How many spaces to count in a tab (project-level config)
const tabToSpaces = 2;
function convertTabsToSpaces(line) {
    return line.replace(/\t/g, " ".repeat(tabToSpaces));
}
function getIndentCount(line) {
    let indent = 0;
    for (const char of line) {
        if (char === " ") {
            indent += 1;
        }
        else {
            return indent;
        }
    }
    return indent;
}
/**
 * Achieves the same thing as https://www.npmjs.com/package/outdent, but a little cleaner
 */
function outdent(contents) {
    let lines = contents.split("\n").map(convertTabsToSpaces);
    // Ignore all-whitespace lines at the beginning and end
    // (which are common in template literals)
    if (lines[0].trim() === "") {
        lines = lines.slice(1);
    }
    if (lines[lines.length - 1].trim() === "") {
        lines = lines.slice(0, lines.length - 1);
    }
    const indentCounts = lines.map(getIndentCount);
    const minIndentCount = Math.min(...indentCounts);
    const trimmedLines = lines.map((line) => line.slice(minIndentCount));
    return trimmedLines.join("\n");
}
exports.outdent = outdent;
//# sourceMappingURL=../../src/helpers/outdent.js.map