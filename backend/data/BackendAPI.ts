import SpellChecker from 'spellchecker';

// Logging
import chalk from 'chalk';

// Types
import {
  Answer,
  BestAnswer,
  KarmaVote,
  Question,
  SearchScope,
} from '../src/Types';

// Utils
import log from '../utils/Logger';
import pool from '../src/pool';

export default class API {
  static getTopicFeed = (req: any, res: any) => {
    const topicPath: string = req.params.topicPath;
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

    const feedResults: any[] = [];

    log.info(req.params.topicPath);
    pool
      .query(query)
      .then((results) => {
        // 1. Get all questions matching query
        const questions = results.rows;
        const q_promises: any = [];

        // 2. For each question, get its' answers
        questions.map((question) => {
          q_promises.push(
            new Promise((resolve, reject) => {
              API.Questions.getAnswers(question.qid).then((answers) => {
                feedResults.push({
                  question,
                  answers,
                });
                resolve(true);
              });
            })
          );
        });

        Promise.all(q_promises).then(() => {
          log.info(feedResults);
          res.status(200).send(feedResults);
        });
      })
      .catch((error) => {
        log.fatal(error);
        res.status(400).send(error);
      });
  };

  static getAllTopics = (req: any, res: any) => {
    pool
      .query(
        `--sql
          SELECT t.topic_path
          FROM topics t;
        `
      )
      .then((results) => {
        res.status(200).send(results.rows);
      })
      .catch((error) => {
        log.fatal(error);
        res.status(400).send(error);
      });
  };

  static getSpellingSuggestions = (string: string) => {
    return new Promise((resolve, reject) => {
      const numSuggestions = 5;
      const corrections = SpellChecker.getCorrectionsForMisspelling(
        string
      ).slice(0, numSuggestions);

      log.info(corrections);
      resolve(corrections);
    });
  };

  static getHotQuestions = (req: any, res: any) => {
    const query = {
      text: `--sql
        SELECT *
        FROM questions
        ORDER BY q_timestamp DESC
        LIMIT 10;
      `,
    };

    const feedResults: any[] = [];

    pool
      .query(query)
      .then((results) => {
        // 1. Get all questions matching query
        const questions = results.rows;
        const q_promises: any = [];

        // 2. For each question, get its' answers
        questions.map((question) => {
          q_promises.push(
            new Promise((resolve, reject) => {
              API.Questions.getAnswers(question.qid).then((answers) => {
                feedResults.push({
                  question,
                  answers,
                });
                resolve(true);
              });
            })
          );
        });

        Promise.all(q_promises).then(() => {
          // log.info(feedResults);
          res.status(200).send(feedResults);
        });
      })
      .catch((error) => {
        log.fatal(error);
        res.status(400).send(error);
      });
  };

  // Search API
  static Search = class {
    // Full text search all questions
    static search = (searchQuery: string, searchScope: string) => {
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
        const searchResults: any[] = [];

        pool
          .query(queryType())
          .then((res) => {
            // 1. Get all questions matching query
            const questions = res.rows;
            const q_promises: any = [];

            // 2. For each question, get its' answers
            questions.map((question) => {
              q_promises.push(
                new Promise((resolve, reject) => {
                  API.Questions.getAnswers(question.qid).then((answers) => {
                    searchResults.push({
                      question,
                      answers,
                    });
                    resolve(true);
                  });
                })
              );
            });

            Promise.all(q_promises).then(() => {
              console.log(
                '\n' +
                  chalk.bold.yellowBright(searchResults.length) +
                  ` search result${
                    searchResults.length !== 1 ? 's' : ''
                  } for ` +
                  chalk.italic.greenBright(`'${searchQuery}'`) +
                  ', in scope: ' +
                  chalk.bold.blue(searchScope)
              );
              // log.info(searchResults);
              resolve(searchResults);
            });
          })
          .catch((error) => {
            log.fatal(error);
            reject(error);
          });
      });
    };
  };

  // Auth API
  static Auth = class {
    static signup = (req: any, res: any) => {
      console.log(req.body);
      const query = {
        text: `--sql
          INSERT INTO users(username, email, password)
          VALUES ($1, $2, $3)
          RETURNING *
        `,
        values: [req.body.username, req.body.email, req.body.password],
      };

      pool
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

    static login = (req: any, res: any) => {
      const { user } = req;
      res.json(user);
    };

    static logout = (req: any, res: any, next: any) => {
      req.logout();
      req.session.destroy((error: any) => {
        if (error) {
          return next(error);
        }
        // The response should indicate that the user is no longer authenticated.
        return res.send({ authenticated: req.isAuthenticated() });
      });
    };

    static currentUser = (req: any, res: any) => {
      if (req.user) {
        res.status(200).send(req.user);
      } else {
        res.status(401).send(null);
      }
    };
  };

  // Users API
  static Users = class {
    static getUserKarma = (req: any, res: any) => {
      const query = {
        text: `--sql
          SELECT SUM(vote)
          FROM karma
          WHERE uid::TEXT = $1
        `,
        values: [req.params.uid],
      };

      pool
        .query(query)
        .then((results) => {
          const userKarma = results.rows[0].sum;
          log.debug(userKarma);
          res.status(200).send(userKarma);
        })
        .catch((error) => {
          res.sendStatus(error);
        });
    };

    static isUsernameAvailable = (req: any, res: any) => {
      const query = {
        text: `--sql
          SELECT username
          FROM users
          WHERE username = $1
          `,
        values: [req.params.username],
      };

      pool
        .query(query)
        .then((results) => {
          const available = results.rowCount === 0;
          log.debug(available);
          res.status(200).send(available);
        })
        .catch((error) => {
          log.fatal(error);
          res.sendStatus(400);
        });
    };

    static updateBio = (req: any, res: any) => {
      const newValue: string = req.body.newValue;

      const query = {
        text: `--sql
          UPDATE Users
          SET bio = $2
          WHERE uid::text = $1
          `,
        values: [req.user, newValue.trim()],
      };

      pool
        .query(query)
        .then((results) => {
          const test = {
            uid: req.user,
            bio: newValue,
          };
          console.log(chalk.blueBright(chalk.bold('UPDATED')), test);
          res.status(200).send(results);
        })
        .catch((error) => {
          log.fatal('Failed to update bio:', error);
          res.status(400).send(error);
        });
    };

    static updateEmail = (req: any, res: any) => {
      const newValue: string = req.body.newValue;

      const query = {
        text: `--sql
          UPDATE Users
          SET email = $2
          WHERE uid::text = $1
          `,
        values: [req.user, newValue.trim()],
      };

      pool
        .query(query)
        .then((results) => {
          const test = {
            uid: req.user,
            email: newValue,
          };
          console.log(chalk.blueBright(chalk.bold('UPDATED')), test);
          res.status(200).send(results);
        })
        .catch((error) => {
          log.fatal('Failed to update email:', error);
          res.status(400).send(error);
        });
    };

    static updateCity = (req: any, res: any) => {
      const newValue: string = req.body.newValue;

      const query = {
        text: `--sql
          UPDATE Users
          SET city = $2
          WHERE uid::text = $1
          `,
        values: [req.user, newValue.trim()],
      };

      pool
        .query(query)
        .then((results) => {
          const test = {
            uid: req.user,
            email: newValue,
          };
          console.log(chalk.blueBright(chalk.bold('UPDATED')), test);
          res.status(200).send(results);
        })
        .catch((error) => {
          log.fatal('Failed to update city:', error);
          res.status(400).send(error);
        });
    };

    static updateState = (req: any, res: any) => {
      const newValue: string = req.body.newValue;

      const query = {
        text: `--sql
          UPDATE Users
          SET state = $2
          WHERE uid::text = $1
          `,
        values: [req.user, newValue.trim()],
      };

      pool
        .query(query)
        .then((results) => {
          const test = {
            uid: req.user,
            email: newValue,
          };
          console.log(chalk.blueBright(chalk.bold('UPDATED')), test);
          res.status(200).send(results);
        })
        .catch((error) => {
          log.fatal('Failed to update state:', error);
          res.status(400).send(error);
        });
    };

    static updateCountry = (req: any, res: any) => {
      const newValue: string = req.body.newValue;

      const query = {
        text: `--sql
          UPDATE Users
          SET country = $2
          WHERE uid::text = $1
          `,
        values: [req.user, newValue.trim()],
      };

      pool
        .query(query)
        .then((results) => {
          const test = {
            uid: req.user,
            email: newValue,
          };
          console.log(chalk.blueBright(chalk.bold('UPDATED')), test);
          res.status(200).send(results);
        })
        .catch((error) => {
          log.fatal('Failed to update country:', error);
          res.status(400).send(error);
        });
    };

    static askQuestion = (req: any, res: any) => {
      const question: Question = req.body;
      const query = {
        text: `--sql
          INSERT INTO questions(uid, title, body, topic)
          VALUES ($1, $2, $3, $4)
          RETURNING qid
          `,
        values: [req.user, question.title, question.body, question.topic],
      };

      pool
        .query(query)
        .then((results) => {
          // Question asked!
          console.log(
            chalk.blueBright(chalk.bold('NEW'), 'question:'),
            question
          );
          res.status(200).send(results.rows[0]);
        })
        .catch((error) => {
          log.fatal(error);
          res.sendStatus(400);
        });
    };

    static getUserQuestions = (req: any, res: any) => {
      const query = {
        text: `--sql
          SELECT *
          FROM questions
          WHERE uid::TEXT = $1;
          `,
        values: [req.params.uid],
      };

      const feedResults: any[] = [];

      pool
        .query(query)
        .then((results) => {
          // 1. Get all questions matching query
          const questions = results.rows;
          const q_promises: any = [];

          // 2. For each question, get its' answers
          questions.map((question) => {
            q_promises.push(
              new Promise((resolve, reject) => {
                API.Questions.getAnswers(question.qid).then((answers) => {
                  feedResults.push({
                    question,
                    answers,
                  });
                  resolve(true);
                });
              })
            );
          });

          Promise.all(q_promises).then(() => {
            // log.info(feedResults);
            res.status(200).send(feedResults);
          });
        })
        .catch((error) => {
          log.fatal(error);
          res.status(400).send(error);
        });
    };

    static getUserAnswers = (req: any, res: any) => {
      const query = {
        text: `--sql
          SELECT q.*
          FROM answers a JOIN questions q ON q.qid = a.qid
          WHERE a.uid::TEXT = $1 ;
          `,
        values: [req.params.uid],
      };

      const feedResults: any[] = [];

      pool
        .query(query)
        .then((results) => {
          // 1. Get all questions matching query
          const questions = results.rows;
          const q_promises: any = [];

          // 2. For each question, get USER's answers
          questions.map((question) => {
            q_promises.push(
              new Promise((resolve, reject) => {
                API.Questions.getAnswersByUser(
                  question.qid,
                  req.params.uid
                ).then((answers) => {
                  feedResults.push({
                    question,
                    answers,
                  });
                  resolve(true);
                });
              })
            );
          });

          Promise.all(q_promises).then(() => {
            // log.info(feedResults);
            res.status(200).send(feedResults);
          });
        })
        .catch((error) => {
          log.fatal(error);
          res.status(400).send(error);
        });
    };

    static getUserFromUsername = (username: string) => {
      const query = {
        text: `--sql
          SELECT *
          FROM users
          WHERE username = $1;
          `,
        values: [username.trim()],
      };

      return new Promise((resolve, reject) => {
        pool
          .query(query)
          .then((res) => {
            const user = res.rows[0];
            resolve(user);
          })
          .catch((error) => {
            log.fatal(error);
            reject(error);
          });
      });
    };

    static getUser = (uid: string) => {
      const query = {
        text: `--sql
          SELECT *
          FROM Users
          WHERE uid::text = $1;
          `,
        values: [uid],
      };

      return new Promise((resolve, reject) => {
        pool
          .query(query)
          .then((res) => {
            const user = res.rows[0];
            resolve(user);
          })
          .catch((error) => {
            log.fatal(error);
            reject(error);
          });
      });
    };
  };

  // Questions API
  static Questions = class {
    static getQuestionPost = (qid: string) => {
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
        pool
          .query(query)
          .then((res) => {
            const question = res.rows[0];
            // Get answers to question
            this.getAnswers(qid).then((answers: Answer[]) => {
              // Get best answer (if exists)
              this.getBestAnswer(question.qid).then(
                (bestAnswer: BestAnswer) => {
                  if (bestAnswer) {
                    const bestAnswer_index = answers.findIndex(
                      (x: Answer) => x.uid === bestAnswer.uid
                    );
                    answers[bestAnswer_index].bestAnswer = true;
                  }
                  answers = answers.map((answer) => ({
                    ...answer,
                    q_uid: question.uid,
                  }));

                  answers = answers?.sort(
                    (a: Answer, b: Answer) =>
                      ((b.bestAnswer as any) || false) -
                      ((a.bestAnswer as any) || false)
                  );

                  resolve({
                    question,
                    answers,
                  });
                }
              );
            });
          })
          .catch((error) => {
            log.fatal(error);
            reject(error);
          });
      });
    };

    static getBestAnswer = (qid: string) => {
      const query = {
        text: `--sql
          SELECT *
          FROM bestanswers
          WHERE qid::TEXT = $1
        `,
        values: [qid],
      };

      return new Promise((resolve, reject) => {
        pool
          .query(query)
          .then((res: any) => {
            resolve(res.rows[0]);
          })
          .catch((error) => {
            log.fatal(error);
            reject(error);
          });
      });
    };

    static getAnswers = (qid: string) => {
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
        pool
          .query(query)
          .then((res: any) => {
            resolve(res.rows);
          })
          .catch((error) => {
            log.fatal(error);
            reject(error);
          });
      });
    };

    static getAnswersByUser = (qid: string, by: string) => {
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
        pool
          .query(query)
          .then((res: any) => {
            resolve(res.rows);
          })
          .catch((error) => {
            log.fatal(error);
            reject(error);
          });
      });
    };
  };

  // Answers API
  static Answers = class {
    static post = (req: any, res: any) => {
      if (req.user) {
        const query = {
          text: `--sql
          INSERT INTO answers(qid, uid, body)
          VALUES ($1, $2, $3)
        `,
          values: [req.body.qid, req.user, req.body.body],
        };

        pool
          .query(query)
          .then((results) => {
            res.sendStatus(200);
          })
          .catch((error) => {
            log.fatal(error);
            res.status(400).send(error);
          });
      } else {
        res.sendStatus(401);
      }
    };

    static selectBestAnswer = (req: any, res: any) => {
      const query = {
        text: `--sql
          INSERT INTO bestanswers(qid, uid)
          VALUES ($1, $2)
          ON CONFLICT (qid)
            DO UPDATE SET uid = $2;
        `,
        values: [req.body.qid, req.body.uid],
      };

      pool
        .query(query)
        .then((results) => {
          res.sendStatus(200);
        })
        .catch((error) => {
          log.fatal(error);
          res.sendStatus(400);
        });
    };

    static checkIfVoted = (
      answerID: any,
      voter_uid: string
    ): Promise<number> => {
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
        pool
          .query(query)
          .then((res) => {
            const vote = res.rowCount > 0 ? res.rows[0].vote : 0;
            resolve(vote);
          })
          .catch((error) => {
            log.fatal(error);
            reject(error);
          });
      });
    };

    static getKarmaCount = (answerID: any): Promise<number> => {
      const parsed = JSON.parse(answerID);
      const query = {
        text: `--sql
          SELECT SUM(vote)
          FROM karma
          WHERE qid::TEXT = $1 AND uid::TEXT = $2;
        `,
        values: [parsed.qid, parsed.uid],
      };

      log.debug(parsed);

      return new Promise((resolve, reject) => {
        pool
          .query(query)
          .then((res) => {
            const sum = res.rows[0].sum;
            log.debug('sum', sum);
            resolve(sum);
          })
          .catch((error) => {
            log.fatal(error);
            reject(error);
          });
      });
    };

    static vote = (karmaVote: KarmaVote) => {
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
        pool
          .query(query)
          .then((res) => {
            log.info(
              chalk.bold('voter_uid:'),
              chalk.yellow(karmaVote.voter_uid),
              `${
                karmaVote.vote === 1
                  ? chalk.italic.green('upvoted')
                  : chalk.italic.redBright('downvoted')
              } ${chalk.bold('answer:')}`,
              `\n${chalk.bold('qid:')} ${chalk.blue(
                karmaVote.qid
              )}\n${chalk.bold('uid:')} ${chalk.yellow(karmaVote.uid)}`
            );
            resolve(res);
          })
          .catch((error) => {
            log.fatal(error);
            reject(error);
          });
      });
    };
  };
}
