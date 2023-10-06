"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRerender = void 0;
const react_1 = require("react");
function useRerender() {
    const [state, setState] = (0, react_1.useState)(0);
    const mounted = (0, react_1.useRef)(true);
    (0, react_1.useEffect)(() => () => {
        mounted.current = false;
    }, []);
    return () => {
        if (!mounted.current)
            return;
        setState((x) => x + 1);
    };
}
exports.useRerender = useRerender;
//# sourceMappingURL=../../src/helpers/useRerender.js.map