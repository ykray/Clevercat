"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_local_1 = require("passport-local");
// APIs
const Pool_1 = __importDefault(require("./Pool"));
// Utils
const Logger_1 = __importDefault(require("../utils/Logger"));
const chalk_1 = __importDefault(require("chalk"));
const passportConfig = (passport) => {
    passport.use(new passport_local_1.Strategy((username, password, done) => {
        const query = {
            text: `--sql
          SELECT u.uid, u.username, u.password
          FROM users u
          WHERE u.username = $1 AND u.password = $2
      `,
            values: [username, password],
        };
        Pool_1.default
            .query(query)
            .then((res) => {
            if (res.rows.length > 0) {
                const user = res.rows[0];
                // TODO: - Handle password match
                console.log(chalk_1.default.blueBright.bold('NEW'), chalk_1.default.bold('login'), user);
                done(null, { uid: user.uid });
            }
            else {
                Logger_1.default.error('issue');
                done(null, false);
            }
        })
            .catch((error) => {
            Logger_1.default.error(error);
            done(error);
        });
    }));
    passport.serializeUser((user, done) => {
        console.log(chalk_1.default.bold('Serialized user:'), chalk_1.default.greenBright(user.uid));
        done(null, user.uid);
    });
    passport.deserializeUser((id, done) => {
        console.log('Deserialize:', id);
        done(null, id);
    });
};
exports.default = passportConfig;
//# sourceMappingURL=passportConfig.js.map