"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslog_1 = require("tslog");
const log = new tslog_1.Logger({
    name: 'myLogger',
    displayLoggerName: false,
    prettyInspectHighlightStyles: {
        string: 'greenBright',
        name: 'white',
    },
});
exports.default = log;
//# sourceMappingURL=Logger.js.map