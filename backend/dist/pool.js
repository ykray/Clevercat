"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const pool = new pg_1.default.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '1889',
    port: 5432,
});
exports.default = pool;
//# sourceMappingURL=pool.js.map