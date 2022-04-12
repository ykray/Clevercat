"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const pool_1 = __importDefault(require("./pool"));
const getUsers = () => {
    return new Promise((resolve, reject) => {
        pool_1.default.query('SELECT * FROM Users', (error, res) => {
            if (error) {
                reject(error);
            }
            resolve(res.rows);
        });
    });
};
exports.getUsers = getUsers;
//# sourceMappingURL=query.js.map