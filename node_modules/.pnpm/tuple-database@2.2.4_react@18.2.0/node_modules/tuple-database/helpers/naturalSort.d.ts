type NumberParse = {
    string: string;
    exponent: {
        negative: boolean;
        integer: string;
    };
    integer: string;
    decimal: string;
    negative: boolean;
};
declare const re: RegExp;
declare const numberRe: RegExp;
declare function parseNumber(str: string): number | undefined;
declare function naturalCompare(a: string, b: string): void;
//# sourceMappingURL=../../src/helpers/naturalSort.d.ts.map