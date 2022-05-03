"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
// Data
const Pool_1 = __importDefault(require("./Pool"));
const BackendAPI_1 = __importDefault(require("../data/BackendAPI"));
const chalk_1 = __importDefault(require("chalk"));
const Logger_1 = __importDefault(require("../utils/Logger"));
const app = (0, express_1.default)();
const port = process.env.PORT;
const { requiresLogin } = require('../middleware/authorization');
const PostgresStore = require('connect-pg-simple')(express_session_1.default);
const sessionOptions = {
    store: new PostgresStore({
        pool: Pool_1.default,
        createTableIfMissing: true, // for "session" table
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 14 * 24 * 60 * 60 * 1000,
        secure: false,
    },
};
// Configure passport
passport_1.default.use(new passport_local_1.Strategy((username, password, done) => {
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
            done(null, user);
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
passport_1.default.serializeUser((user, done) => {
    console.log(chalk_1.default.bold('Serializing user:'), chalk_1.default.greenBright(user.uid));
    done(null, user.uid);
});
passport_1.default.deserializeUser((id, done) => {
    console.log(chalk_1.default.bold('Deserializing user:'), chalk_1.default.greenBright(id));
    BackendAPI_1.default.Users.getUser(String(id))
        .then((user) => {
        done(null, user.uid);
    })
        .catch((error) => {
        done(error, null);
    });
});
// Middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', process.env.ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization');
    next();
});
app.use((0, cors_1.default)({
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true,
    origin: process.env.ORIGIN,
}));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use((0, express_session_1.default)(sessionOptions));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.json());
// ROUTES
app.get('/', (req, res) => {
    res.status(200).send('hi');
});
app.post('/auth/signup', BackendAPI_1.default.Auth.signup);
app.post('/auth/login', passport_1.default.authenticate('local'), BackendAPI_1.default.Auth.login);
app.delete('/auth/logout', BackendAPI_1.default.Auth.logout);
app.get('/auth/current-user', BackendAPI_1.default.Auth.currentUser);
// Users Routes
app.get('/available/:username', BackendAPI_1.default.Users.isUsernameAvailable);
app.get('/usernames/:username', (req, res) => {
    BackendAPI_1.default.Users.getUserFromUsername(req.params.username)
        .then((user) => {
        res.status(200).send(user);
    })
        .catch((error) => {
        res.status(500).send(error);
    });
});
app.get('/u/:uid', (req, res) => {
    BackendAPI_1.default.Users.getUser(req.params.uid)
        .then((user) => {
        res.status(200).send(user);
    })
        .catch((error) => {
        res.status(500).send(error);
    });
});
app.get('/u/:uid/questions', BackendAPI_1.default.Users.getUserQuestions);
app.get('/u/:uid/answers', BackendAPI_1.default.Users.getUserAnswers);
app.post('/updateBio', BackendAPI_1.default.Users.updateBio);
app.post('/ask', BackendAPI_1.default.Users.askQuestion);
// Search Routes
app.get('/search/:searchScope/:searchQuery', (req, res) => {
    const scope = JSON.parse(req.params.searchScope);
    BackendAPI_1.default.Search.search(req.params.searchQuery, scope)
        .then((searchResults) => {
        res.status(200).send(searchResults);
    })
        .catch((error) => {
        res.status(500).send(error);
    });
});
// Questions Routes
app.get('/q/:qid', (req, res) => {
    BackendAPI_1.default.Questions.getQuestionPost(req.params.qid)
        .then((questionPost) => {
        res.status(200).send(questionPost);
    })
        .catch((error) => {
        res.status(500).send(error);
    });
});
// Answers Routes
app.get('/votes/:answerID/:voter_uid', (req, res) => {
    BackendAPI_1.default.Answers.checkIfVoted(req.params.answerID, req.params.voter_uid)
        .then((response) => {
        res.status(200).send(response.toString());
    })
        .catch((error) => {
        res.status(500).send(error);
    });
});
app.post('/post-answer', requiresLogin, BackendAPI_1.default.Answers.post);
app.post('/select-best-answer', requiresLogin, BackendAPI_1.default.Answers.selectBestAnswer);
app.get('/karma/:answerID', (req, res) => {
    BackendAPI_1.default.Answers.getKarmaCount(req.params.answerID)
        .then((count) => {
        res.status(200).send(count.toString());
    })
        .catch((error) => {
        res.status(500).send(error);
    });
});
app.post('/vote', (req, res) => {
    BackendAPI_1.default.Answers.vote(req.body)
        .then((response) => {
        res.status(200).send(response);
    })
        .catch((error) => {
        res.status(500).send(error);
    });
});
// Other Routes
app.get('/topics/:topicPath', BackendAPI_1.default.getTopicFeed);
app.get('/all-topics', (req, res) => {
    BackendAPI_1.default.getAllTopics()
        .then((topics) => {
        res.status(200).send(topics);
    })
        .catch((error) => {
        res.status(500).send(error);
    });
});
app.get('/hot', (req, res) => {
    BackendAPI_1.default.getHotQuestions()
        .then((posts) => {
        res.status(200).send(posts);
    })
        .catch((error) => {
        res.status(500).send(error);
    });
});
app.get('/spellcheck/:string', (req, res) => {
    BackendAPI_1.default.getSpellingSuggestions(req.params.string).then((corrections) => {
        res.status(200).send(corrections);
    });
});
app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
//# sourceMappingURL=index.js.map