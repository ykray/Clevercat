"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const spellchecker_1 = __importDefault(require("spellchecker"));
// Logging
const chalk_1 = __importDefault(require("chalk"));
// Utils
const Logger_1 = __importDefault(require("../utils/Logger"));
const pool_1 = __importDefault(require("../src/pool"));
class API {
    static getTopicFeed = (req, res) => {
        const topicPath = req.params.topicPath;
        const query = {
            text: `--sql
        SELECT *
        FROM Questions
        WHERE topic::text LIKE '%' || $1 || '%'
        ORDER BY q_timestamp DESC
        LIMIT 10;
      `,
            values: [topicPath],
        };
        const feedResults = [];
        Logger_1.default.info(req.params.topicPath);
        pool_1.default
            .query(query)
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
                Logger_1.default.info(feedResults);
                res.status(200).send(feedResults);
            });
        })
            .catch((error) => {
            Logger_1.default.fatal(error);
            res.status(400).send(error);
        });
    };
    static getAllTopics = (req, res) => {
        pool_1.default
            .query(`--sql
          SELECT t.topic_path
          FROM topics t;
        `)
            .then((results) => {
            res.status(200).send(results.rows);
        })
            .catch((error) => {
            Logger_1.default.fatal(error);
            res.status(400).send(error);
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
    static getHotQuestions = (req, res) => {
        const query = {
            text: `--sql
        SELECT *
        FROM questions
        ORDER BY q_timestamp DESC
        LIMIT 10;
      `,
        };
        const feedResults = [];
        pool_1.default
            .query(query)
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
          OR q.topic::TEXT ILIKE '%' || $1 || '%'
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
            TO_TSVECTOR(q.title || '' || q.body || '' || COALESCE(a.body, '')) @@ PLAINTO_TSQUERY(v.term)
          ORDER BY q.qid, rank DESC;
        `,
                values: [searchQuery],
            };
            // TODO: - Fix scope handling & SearchScope type implementation to clean up
            const queryType = () => {
                switch (searchScope) {
                    case 'questions':
                        return query_questions;
                    case 'answers':
                        return query_answers;
                    default:
                        return query_all;
                }
            };
            return new Promise((resolve, reject) => {
                const searchResults = [];
                pool_1.default
                    .query(queryType())
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
    // Auth API
    static Auth = class {
        static signup = (req, res) => {
            console.log(req.body);
            const query = {
                text: `--sql
          INSERT INTO users(username, email, password)
          VALUES ($1, $2, $3)
          RETURNING *
        `,
                values: [req.body.username, req.body.email, req.body.password],
            };
            pool_1.default
                .query(query)
                .then((results) => {
                const user = JSON.parse(results.rows[0]);
                req.sendStatus(200);
            })
                .catch((error) => {
                // log.fatal(error);
                res.sendStatus(400);
            });
        };
        static login = (req, res) => {
            const { user } = req;
            res.json(user);
        };
        static logout = (req, res, next) => {
            req.logout();
            req.session.destroy((error) => {
                if (error) {
                    return next(error);
                }
                // The response should indicate that the user is no longer authenticated.
                return res.send({ authenticated: req.isAuthenticated() });
            });
        };
        static currentUser = (req, res) => {
            if (req.user) {
                res.status(200).send(req.user);
            }
            else {
                res.status(401).send(null);
            }
        };
    };
    // Users API
    static Users = class {
        static getUserKarma = (req, res) => {
            const query = {
                text: `--sql
          SELECT SUM(vote)
          FROM karma
          WHERE uid::TEXT = $1
        `,
                values: [req.params.uid],
            };
            pool_1.default
                .query(query)
                .then((results) => {
                const userKarma = results.rows[0].sum;
                Logger_1.default.debug(userKarma);
                res.status(200).send(userKarma);
            })
                .catch((error) => {
                res.sendStatus(error);
            });
        };
        static isUsernameAvailable = (req, res) => {
            const query = {
                text: `--sql
          SELECT username
          FROM users
          WHERE username = $1
          `,
                values: [req.params.username],
            };
            pool_1.default
                .query(query)
                .then((results) => {
                const available = results.rowCount === 0;
                Logger_1.default.debug(available);
                res.status(200).send(available);
            })
                .catch((error) => {
                Logger_1.default.fatal(error);
                res.sendStatus(400);
            });
        };
        static updateBio = (req, res) => {
            const newValue = req.body.newValue;
            const query = {
                text: `--sql
          UPDATE Users
          SET bio = $2
          WHERE uid::text = $1
          `,
                values: [req.user, newValue.trim()],
            };
            pool_1.default
                .query(query)
                .then((results) => {
                const test = {
                    uid: req.user,
                    bio: newValue,
                };
                console.log(chalk_1.default.blueBright(chalk_1.default.bold('UPDATED')), test);
                res.status(200).send(results);
            })
                .catch((error) => {
                Logger_1.default.fatal('Failed to update bio:', error);
                res.status(400).send(error);
            });
        };
        static updateEmail = (req, res) => {
            const newValue = req.body.newValue;
            const query = {
                text: `--sql
          UPDATE Users
          SET email = $2
          WHERE uid::text = $1
          `,
                values: [req.user, newValue.trim()],
            };
            pool_1.default
                .query(query)
                .then((results) => {
                const test = {
                    uid: req.user,
                    email: newValue,
                };
                console.log(chalk_1.default.blueBright(chalk_1.default.bold('UPDATED')), test);
                res.status(200).send(results);
            })
                .catch((error) => {
                Logger_1.default.fatal('Failed to update email:', error);
                res.status(400).send(error);
            });
        };
        static updateCity = (req, res) => {
            const newValue = req.body.newValue;
            const query = {
                text: `--sql
          UPDATE Users
          SET city = $2
          WHERE uid::text = $1
          `,
                values: [req.user, newValue.trim()],
            };
            pool_1.default
                .query(query)
                .then((results) => {
                const test = {
                    uid: req.user,
                    email: newValue,
                };
                console.log(chalk_1.default.blueBright(chalk_1.default.bold('UPDATED')), test);
                res.status(200).send(results);
            })
                .catch((error) => {
                Logger_1.default.fatal('Failed to update city:', error);
                res.status(400).send(error);
            });
        };
        static updateState = (req, res) => {
            const newValue = req.body.newValue;
            const query = {
                text: `--sql
          UPDATE Users
          SET state = $2
          WHERE uid::text = $1
          `,
                values: [req.user, newValue.trim()],
            };
            pool_1.default
                .query(query)
                .then((results) => {
                const test = {
                    uid: req.user,
                    email: newValue,
                };
                console.log(chalk_1.default.blueBright(chalk_1.default.bold('UPDATED')), test);
                res.status(200).send(results);
            })
                .catch((error) => {
                Logger_1.default.fatal('Failed to update state:', error);
                res.status(400).send(error);
            });
        };
        static updateCountry = (req, res) => {
            const newValue = req.body.newValue;
            const query = {
                text: `--sql
          UPDATE Users
          SET country = $2
          WHERE uid::text = $1
          `,
                values: [req.user, newValue.trim()],
            };
            pool_1.default
                .query(query)
                .then((results) => {
                const test = {
                    uid: req.user,
                    email: newValue,
                };
                console.log(chalk_1.default.blueBright(chalk_1.default.bold('UPDATED')), test);
                res.status(200).send(results);
            })
                .catch((error) => {
                Logger_1.default.fatal('Failed to update country:', error);
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
            pool_1.default
                .query(query)
                .then((results) => {
                // Question asked!
                console.log(chalk_1.default.blueBright(chalk_1.default.bold('NEW'), 'question:'), question);
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
          WHERE uid::TEXT = $1;
          `,
                values: [req.params.uid],
            };
            const feedResults = [];
            pool_1.default
                .query(query)
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
        static getUserAnswers = (req, res) => {
            const query = {
                text: `--sql
          SELECT q.*
          FROM answers a JOIN questions q ON q.qid = a.qid
          WHERE a.uid::TEXT = $1 ;
          `,
                values: [req.params.uid],
            };
            const feedResults = [];
            pool_1.default
                .query(query)
                .then((results) => {
                // 1. Get all questions matching query
                const questions = results.rows;
                const q_promises = [];
                // 2. For each question, get USER's answers
                questions.map((question) => {
                    q_promises.push(new Promise((resolve, reject) => {
                        API.Questions.getAnswersByUser(question.qid, req.params.uid).then((answers) => {
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
                pool_1.default
                    .query(query)
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
                pool_1.default
                    .query(query)
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
          SELECT q.*
          FROM Questions q
          WHERE qid::TEXT = $1
          FETCH FIRST ROW ONLY;
        `,
                values: [qid],
            };
            return new Promise((resolve, reject) => {
                pool_1.default
                    .query(query)
                    .then((res) => {
                    const question = res.rows[0];
                    // Get answers to question
                    this.getAnswers(qid).then((answers) => {
                        // Get best answer (if exists)
                        this.getBestAnswer(question.qid).then((bestAnswer) => {
                            if (bestAnswer) {
                                const bestAnswer_index = answers.findIndex((x) => x.uid === bestAnswer.uid);
                                answers[bestAnswer_index].bestAnswer = true;
                            }
                            answers = answers.map((answer) => ({
                                ...answer,
                                q_uid: question.uid,
                            }));
                            answers = answers?.sort((a, b) => (b.bestAnswer || false) -
                                (a.bestAnswer || false));
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
          FROM bestanswers
          WHERE qid::TEXT = $1
        `,
                values: [qid],
            };
            return new Promise((resolve, reject) => {
                pool_1.default
                    .query(query)
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
          WHERE a.qid::TEXT = $1
          `,
                values: [qid],
            };
            return new Promise((resolve, reject) => {
                pool_1.default
                    .query(query)
                    .then((res) => {
                    resolve(res.rows);
                })
                    .catch((error) => {
                    Logger_1.default.fatal(error);
                    reject(error);
                });
            });
        };
        static getAnswersByUser = (qid, by) => {
            const query = {
                text: `--sql
          SELECT
            a.qid,
            a.body,
            a.uid,
            a.a_timestamp
          FROM Answers a
            JOIN Questions q ON a.qid = q.qid
          WHERE a.qid::TEXT = $1
            AND a.uid::TEXT = $2
          `,
                values: [qid, by],
            };
            return new Promise((resolve, reject) => {
                pool_1.default
                    .query(query)
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
        static post = (req, res) => {
            if (req.user) {
                const query = {
                    text: `--sql
          INSERT INTO answers(qid, uid, body)
          VALUES ($1, $2, $3)
        `,
                    values: [req.body.qid, req.user, req.body.body],
                };
                pool_1.default
                    .query(query)
                    .then((results) => {
                    res.sendStatus(200);
                })
                    .catch((error) => {
                    Logger_1.default.fatal(error);
                    res.status(400).send(error);
                });
            }
            else {
                res.sendStatus(401);
            }
        };
        static selectBestAnswer = (req, res) => {
            const query = {
                text: `--sql
          INSERT INTO bestanswers(qid, uid)
          VALUES ($1, $2)
          ON CONFLICT (qid)
            DO UPDATE SET uid = $2;
        `,
                values: [req.body.qid, req.body.uid],
            };
            pool_1.default
                .query(query)
                .then((results) => {
                res.sendStatus(200);
            })
                .catch((error) => {
                Logger_1.default.fatal(error);
                res.sendStatus(400);
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
                pool_1.default
                    .query(query)
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
          FROM karma
          WHERE qid::TEXT = $1 AND uid::TEXT = $2;
        `,
                values: [parsed.qid, parsed.uid],
            };
            Logger_1.default.debug(parsed);
            return new Promise((resolve, reject) => {
                pool_1.default
                    .query(query)
                    .then((res) => {
                    const sum = res.rows[0].sum;
                    Logger_1.default.debug('sum', sum);
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
                pool_1.default
                    .query(query)
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