// numbers
// decimals
// scientific notation
// case insensitive
const re = new RegExp([/[-+]/, /[0-9]+/, /[0-9]+/].map((r) => r.source).join(""));
const numberRe = /([-+])?([0-9]+)?(\.[0-9]*)?(e[+-]?[0-9]+)?/g;
function parseNumber(str) {
    const match = str.match(numberRe);
    if (!match)
        return;
    return parseFloat(match[0].replace(/,/g, ""));
}
// "1".match(re)
// "1.9".match(re)
// ".1".match(re)
// "-12.1".match(re)
// "+12.1e14".match(re)
function naturalCompare(a, b) {
    let i = 0;
    while (i < a.length && i < b.length) {
        // if () {}
    }
}
//# sourceMappingURL=../../src/helpers/naturalSort.js.map