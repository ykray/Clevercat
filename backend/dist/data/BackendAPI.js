"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Pool_1 = __importDefault(require("../src/Pool"));
const spellchecker_1 = __importDefault(require("spellchecker"));
const chalk_1 = __importDefault(require("chalk"));
// Types
const Types_1 = require("../src/Types");
// Utils
const Logger_1 = __importDefault(require("../utils/Logger"));
const Pool_2 = __importDefault(require("../src/Pool"));
class API {
    static getTopics = () => {
        return new Promise((resolve, reject) => {
            Pool_1.default.query(`--sql
          SELECT t.topic_path
          FROM topics t;
        `)
                .then((res) => {
                resolve(res.rows);
            })
                .catch((error) => {
                Logger_1.default.fatal(error);
                reject(error);
            });
        });
    };
    static getSpellingSuggestions = (string) => {
        return new Promise((resolve, reject) => {
            const numSuggestions = 5;
            const corrections = spellchecker_1.default.getCorrectionsForMisspelling(string).slice(0, numSuggestions);
            Logger_1.default.info(corrections);
            resolve(corrections);
        });
    };
    static getHotQuestions = () => {
        const query = {
            text: `--sql
        SELECT *
        FROM Questions
        ORDER BY q_timestamp DESC
        LIMIT 10;
      `,
        };
        return new Promise((resolve, reject) => {
            const feedResults = [];
            Pool_1.default.query(query)
                .then((res) => {
                // 1. Get all questions matching query
                const questions = res.rows;
                const q_promises = [];
                // 2. For each question, get its' answers
                questions.map((question) => {
                    q_promises.push(new Promise((resolve, reject) => {
                        API.Questions.getAnswers(question.qid).then((answers) => {
                            feedResults.push({
                                question,
                                answers,
                            });
                            resolve(true);
                        });
                    }));
                });
                Promise.all(q_promises).then(() => {
                    // log.info(feedResults);
                    resolve(feedResults);
                });
            })
                .catch((error) => {
                Logger_1.default.fatal(error);
                reject(error);
            });
        });
    };
    // Search API
    static Search = class {
        // Full text search all questions
        static search = (searchQuery, searchScope) => {
            const query_questions = {
                text: `--sql
          SELECT q.*
          FROM Questions q
          WHERE q.title ILIKE '%' || $1 || '%'
          OR q.body ILIKE '%' || $1 || '%'
          OR q.topic ILIKE '%' || $1 || '%'
        `,
                values: [searchQuery],
            };
            const query_answers = {
                text: `--sql
          SELECT q.*
          FROM Answers a
            JOIN Questions q ON a.qid = q.qid
          WHERE a.body ILIKE '%' || $1 || '%'
          LIMIT 20;
        `,
                values: [searchQuery],
            };
            const query_all = {
                // (OLD) - Basic text search
                // text: `--sql
                //   -- Search questions
                //   SELECT q.*
                //   FROM Questions q
                //   WHERE q.title ILIKE '%' || $1 || '%'
                //   OR q.body ILIKE '%' || $1 || '%'
                //   OR q.topic ILIKE '%' || $1 || '%'
                //   UNION
                //   -- Search answers
                //   SELECT q.*
                //   FROM Answers a
                //     JOIN Questions q ON a.qid = q.qid
                //   WHERE a.body ILIKE '%' || $1 || '%'
                //   LIMIT 20;
                // `,
                // (NEW) - TSVECTOR-powered, lexeme text search
                text: `--sql
          WITH variables (term) AS (VALUES ($1))
          SELECT DISTINCT ON (q.qid) q.*,
            TO_TSVECTOR(q.title || '' || q.body || '' || COALESCE(a.body, '')) AS tsv_search,
            TS_RANK(TO_TSVECTOR(q.title || '' || q.body || '' || COALESCE(a.body, '')),
            PLAINTO_TSQUERY(v.term)) AS rank
          FROM
            variables v,
            questions q
              JOIN answers a ON q.qid = a.qid
          WHERE
            TO_TSVECTOR(q.title || '' || q.body || '' || COALESCE(a.body, '')) @@ PLAINTO_TSQUERY(v.term) AND
            q.topic = 'Science.Biology'
          ORDER BY q.qid, rank DESC;
        `,
                values: [searchQuery],
            };
            const query = searchScope === Types_1.SearchScope.Questions
                ? query_questions
                : Types_1.SearchScope.Answers
                    ? query_answers
                    : query_all;
            return new Promise((resolve, reject) => {
                const searchResults = [];
                Pool_1.default.query(query)
                    .then((res) => {
                    // 1. Get all questions matching query
                    const questions = res.rows;
                    const q_promises = [];
                    // 2. For each question, get its' answers
                    questions.map((question) => {
                        q_promises.push(new Promise((resolve, reject) => {
                            API.Questions.getAnswers(question.qid).then((answers) => {
                                searchResults.push({
                                    question,
                                    answers,
                                });
                                resolve(true);
                            });
                        }));
                    });
                    Promise.all(q_promises).then(() => {
                        console.log('\n' +
                            chalk_1.default.bold.yellowBright(searchResults.length) +
                            ` search result${searchResults.length !== 1 ? 's' : ''} for ` +
                            chalk_1.default.italic.greenBright(`'${searchQuery}'`) +
                            ', in scope: ' +
                            chalk_1.default.bold.blue(searchScope));
                        // log.info(searchResults);
                        resolve(searchResults);
                    });
                })
                    .catch((error) => {
                    Logger_1.default.fatal(error);
                    reject(error);
                });
            });
        };
    };
    // Users API
    static Users = class {
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
        static currentUser = (req, res) => {
            res.status(200).send(req.user);
        };
        static updateBio = (req, res) => {
            const newBio = req.body.newBio;
            Logger_1.default.debug(req.user);
            const query = {
                text: `--sql
          UPDATE Users
          SET bio = $2
          WHERE uid::text = $1
          `,
                values: [req.user, newBio.trim()],
            };
            Pool_1.default.query(query)
                .then((results) => {
                const test = {
                    uid: req.user,
                    bio: newBio,
                };
                console.log(chalk_1.default.blueBright(chalk_1.default.bold('UPDATED')), test);
                res.status(200).send(results);
            })
                .catch((error) => {
                Logger_1.default.fatal('Failed to update bio:', error);
                res.status(400).send(error);
            });
        };
        static askQuestion = (req, res) => {
            const question = req.body;
            const query = {
                text: `--sql
          INSERT INTO questions(uid, title, body, topic)
          VALUES ($1, $2, $3, $4)
          RETURNING qid
          `,
                values: [req.user, question.title, question.body, question.topic],
            };
            Pool_2.default
                .query(query)
                .then((results) => {
                // Question asked!
                console.log(chalk_1.default.blueBright(chalk_1.default.bold('NEW'), 'question'), question);
                res.status(200).send(results.rows[0]);
            })
                .catch((error) => {
                Logger_1.default.fatal(error);
                res.sendStatus(400);
            });
        };
        static getUserQuestions = (req, res) => {
            const query = {
                text: `--sql
          SELECT *
          FROM questions
          WHERE uid::text = $1;
          `,
                values: [req.params.uid],
            };
            const feedResults = [];
            Pool_1.default.query(query)
                .then((results) => {
                // 1. Get all questions matching query
                const questions = results.rows;
                const q_promises = [];
                // 2. For each question, get its' answers
                questions.map((question) => {
                    q_promises.push(new Promise((resolve, reject) => {
                        API.Questions.getAnswers(question.qid).then((answers) => {
                            feedResults.push({
                                question,
                                answers,
                            });
                            resolve(true);
                        });
                    }));
                });
                Promise.all(q_promises).then(() => {
                    // log.info(feedResults);
                    res.status(200).send(feedResults);
                });
            })
                .catch((error) => {
                Logger_1.default.fatal(error);
                res.status(400).send(error);
            });
        };
        static getUserFromUsername = (username) => {
            const query = {
                text: `--sql
          SELECT *
          FROM users
          WHERE username = $1;
          `,
                values: [username.trim()],
            };
            return new Promise((resolve, reject) => {
                Pool_1.default.query(query)
                    .then((res) => {
                    const user = res.rows[0];
                    resolve(user);
                })
                    .catch((error) => {
                    Logger_1.default.fatal(error);
                    reject(error);
                });
            });
        };
        static getUser = (uid) => {
            const query = {
                text: `--sql
          SELECT *
          FROM Users
          WHERE uid::text = $1;
          `,
                values: [uid],
            };
            return new Promise((resolve, reject) => {
                Pool_1.default.query(query)
                    .then((res) => {
                    const user = res.rows[0];
                    resolve(user);
                })
                    .catch((error) => {
                    Logger_1.default.fatal(error);
                    reject(error);
                });
            });
        };
    };
    // Questions API
    static Questions = class {
        static getQuestionPost = (qid) => {
            const query = {
                text: `--sql
          SELECT
            q.*
          FROM Questions q
          WHERE qid::TEXT = $1
          FETCH FIRST ROW ONLY;
        `,
                values: [qid],
            };
            return new Promise((resolve, reject) => {
                Pool_1.default.query(query)
                    .then((res) => {
                    const question = res.rows[0];
                    // Get answers to question
                    this.getAnswers(qid).then((answers) => {
                        // Get best answer (if exists)
                        this.getBestAnswer(qid).then((bestAnswer) => {
                            if (bestAnswer) {
                                const bestAnswer_index = answers.findIndex((x) => x.qid === bestAnswer.qid);
                                answers[bestAnswer_index].bestAnswer = true;
                            }
                            answers = answers.map((answer) => ({
                                ...answer,
                                q_uid: 's',
                            }));
                            Logger_1.default.debug(answers);
                            resolve({
                                question,
                                answers,
                            });
                        });
                    });
                })
                    .catch((error) => {
                    Logger_1.default.fatal(error);
                    reject(error);
                });
            });
        };
        static getBestAnswer = (qid) => {
            const query = {
                text: `--sql
          SELECT *
          FROM BestAnswers b
          WHERE b.qid = $1;
        `,
                values: [qid],
            };
            return new Promise((resolve, reject) => {
                Pool_1.default.query(query)
                    .then((res) => {
                    resolve(res.rows[0]);
                })
                    .catch((error) => {
                    Logger_1.default.fatal(error);
                    reject(error);
                });
            });
        };
        static getAnswers = (qid) => {
            const query = {
                text: `--sql
          SELECT
            a.qid,
            a.body,
            a.uid,
            a.a_timestamp
          FROM Answers a
            JOIN Questions q ON a.qid = q.qid
          WHERE a.qid::TEXT = $1;
        `,
                values: [qid],
            };
            return new Promise((resolve, reject) => {
                Pool_1.default.query(query)
                    .then((res) => {
                    resolve(res.rows);
                })
                    .catch((error) => {
                    Logger_1.default.fatal(error);
                    reject(error);
                });
            });
        };
    };
    // Answers API
    static Answers = class {
        static best = (req, res) => {
            const query = {
                text: `--sql
          INSERT INTO bestAnswer(qid, uid)
          VALUES ($1, $2)
          ON CONFLICT (qid, uid)
            DO UPDATE SET uid = $2;
        `,
                values: [req.body.qid, req.body.uid],
            };
            return new Promise((resolve, reject) => {
                Pool_2.default
                    .query(query)
                    .then((results) => {
                    resolve(results);
                })
                    .catch((error) => {
                    reject(error);
                });
            });
        };
        static checkIfVoted = (answerID, voter_uid) => {
            const _answerID = JSON.parse(answerID);
            const query = {
                text: `--sql
          SELECT vote
          FROM Karma
          WHERE
            qid::TEXT = $1 AND
            uid::TEXT = $2 AND
            voter_uid::TEXT = $3
        `,
                values: [_answerID.qid, _answerID.uid, voter_uid],
            };
            return new Promise((resolve, reject) => {
                Pool_1.default.query(query)
                    .then((res) => {
                    const vote = res.rowCount > 0 ? res.rows[0].vote : 0;
                    resolve(vote);
                })
                    .catch((error) => {
                    Logger_1.default.fatal(error);
                    reject(error);
                });
            });
        };
        static getKarmaCount = (answerID) => {
            const parsed = JSON.parse(answerID);
            const query = {
                text: `--sql
          SELECT SUM(vote)
          FROM Karma
          WHERE qid::TEXT = $1 AND uid::TEXT = $2;
        `,
                values: [parsed.qid, parsed.uid],
            };
            return new Promise((resolve, reject) => {
                Pool_1.default.query(query)
                    .then((res) => {
                    const sum = Number(res.rows[0].sum) || 0;
                    resolve(sum);
                })
                    .catch((error) => {
                    Logger_1.default.fatal(error);
                    reject(error);
                });
            });
        };
        static vote = (karmaVote) => {
            const query = {
                text: `--sql
          INSERT INTO Karma(qid, uid, voter_uid, vote)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (qid, uid, voter_uid)
            DO UPDATE SET vote = $4;
        `,
                values: [
                    karmaVote.qid,
                    karmaVote.uid,
                    karmaVote.voter_uid,
                    karmaVote.vote,
                ],
            };
            return new Promise((resolve, reject) => {
                Pool_1.default.query(query)
                    .then((res) => {
                    Logger_1.default.info(chalk_1.default.bold('voter_uid:'), chalk_1.default.yellow(karmaVote.voter_uid), `${karmaVote.vote === 1
                        ? chalk_1.default.italic.green('upvoted')
                        : chalk_1.default.italic.redBright('downvoted')} ${chalk_1.default.bold('answer:')}`, `\n${chalk_1.default.bold('qid:')} ${chalk_1.default.blue(karmaVote.qid)}\n${chalk_1.default.bold('uid:')} ${chalk_1.default.yellow(karmaVote.uid)}`);
                    resolve(res);
                })
                    .catch((error) => {
                    Logger_1.default.fatal(error);
                    reject(error);
                });
            });
        };
    };
}
exports.default = API;
//# sourceMappingURL=BackendAPI.js.map