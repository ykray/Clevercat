"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const queries_1 = require("./queries");
const app = (0, express_1.default)();
const port = 3001;
app.use(express_1.default.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
});
app.get('/', (req, res) => {
    (0, queries_1.getUsers)()
        .then((response) => {
        res.status(200).send(response);
    })
        .catch((error) => {
        res.status(500).send(error);
    });
});
app.get('/q', (req, res) => {
    (0, queries_1.getQuestion)('dbb83e83-02ed-4c3a-90d6-e711264fdf94')
        .then((response) => {
        res.status(200).send(response);
    })
        .catch((error) => {
        res.status(500).send(error);
    });
});
app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
//# sourceMappingURL=index.js.map