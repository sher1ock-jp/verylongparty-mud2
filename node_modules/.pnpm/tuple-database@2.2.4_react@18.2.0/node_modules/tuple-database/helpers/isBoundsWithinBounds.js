"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBoundsWithinBounds = void 0;
const compareTuple_1 = require("./compareTuple");
function isLessThanOrEqualTo(a, b) {
    return (0, compareTuple_1.compareTuple)(a, b) !== 1;
}
function isLessThan(a, b) {
    return (0, compareTuple_1.compareTuple)(a, b) === -1;
}
function isGreaterThanOrEqualTo(a, b) {
    return (0, compareTuple_1.compareTuple)(a, b) !== -1;
}
function isGreaterThan(a, b) {
    return (0, compareTuple_1.compareTuple)(a, b) === 1;
}
function isBoundsWithinBounds(args) {
    const { bounds, container } = args;
    if (container.gt) {
        if (bounds.gt) {
            if (!isGreaterThanOrEqualTo(bounds.gt, container.gt))
                return false;
        }
        if (bounds.gte) {
            if (!isGreaterThan(bounds.gte, container.gt))
                return false;
        }
    }
    if (container.gte) {
        if (bounds.gt) {
            if (!isGreaterThanOrEqualTo(bounds.gt, container.gte))
                return false;
        }
        if (bounds.gte) {
            if (!isGreaterThanOrEqualTo(bounds.gte, container.gte))
                return false;
        }
    }
    if (container.lt) {
        if (bounds.lt) {
            if (!isLessThanOrEqualTo(bounds.lt, container.lt))
                return false;
        }
        if (bounds.lte) {
            if (!isLessThan(bounds.lte, container.lt))
                return false;
        }
    }
    if (container.lte) {
        if (bounds.lt) {
            if (!isLessThanOrEqualTo(bounds.lt, container.lte))
                return false;
        }
        if (bounds.lte) {
            if (!isLessThanOrEqualTo(bounds.lte, container.lte))
                return false;
        }
    }
    // if (bounds.lt) {
    // 	if (container.lt && !isLessThanOrEqualTo(bounds.lt, container.lt))
    // 		return false
    // 	if (container.lte && !isLessThanOrEqualTo(bounds.lt, container.lte))
    // 		return false
    // }
    // if (bounds.lte) {
    // 	if (container.lt && isLessThan(bounds.lte, container.lt)) return false
    // 	if (container.lte && isLessThanOrEqualTo(bounds.lte, container.lte))
    // 		return false
    // }
    // if (bounds.gt) {
    // 	if (container.gt && !isGreaterThanOrEqualTo(bounds.gt, container.gt))
    // 		return false
    // 	if (container.gte && !isGreaterThanOrEqualTo(bounds.gt, container.gte))
    // 		return false
    // }
    // if (bounds.gte) {
    // 	if (container.gt && isGreaterThan(bounds.gte, container.gt)) return false
    // 	if (container.gte && isGreaterThanOrEqualTo(bounds.gte, container.gte))
    // 		return false
    // }
    return true;
}
exports.isBoundsWithinBounds = isBoundsWithinBounds;
//# sourceMappingURL=../../src/helpers/isBoundsWithinBounds.js.map