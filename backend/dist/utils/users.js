"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Users {
    static login = (req, res) => {
        const { user } = req;
        res.json(user);
    };
    static logout = (req, res, next) => {
        req.session.destroy((err) => {
            if (err)
                return next(err);
            req.logout();
            res.sendStatus(200);
        });
    };
    static ping = (req, res) => {
        if (req.user) {
            res.json(req.user);
        }
    };
}
exports.default = Users;
//# sourceMappingURL=users.js.map