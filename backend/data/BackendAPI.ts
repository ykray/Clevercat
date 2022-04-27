import Pool from '../src/Pool';
import SpellChecker from 'spellchecker';
import chalk from 'chalk';

// Types
import { Answer, BestAnswer, KarmaVote, SearchScope } from '../src/Types';

// Utils
import log from '../utils/Logger';

export default class API {
  static getTopics = () => {
    return new Promise((resolve, reject) => {
      Pool.query(
        `--sql
          SELECT t.topic_path
          FROM topics t;
        `
      )
        .then((res) => {
          resolve(res.rows);
        })
        .catch((error) => {
          log.fatal(error);
          reject(error);
        });
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
      let feedResults: any[] = [];

      Pool.query(query)
        .then((res) => {
          // 1. Get all questions matching query
          const questions = res.rows;
          let q_promises: any = [];

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
            resolve(feedResults);
          });
        })
        .catch((error) => {
          log.fatal(error);
          reject(error);
        });
    });
  };

  // Search API
  static Search = class {
    // Full text search all questions
    static search = (searchQuery: string, searchScope: SearchScope) => {
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
      const query =
        searchScope === SearchScope.Questions
          ? query_questions
          : SearchScope.Answers
          ? query_answers
          : query_all;

      return new Promise((resolve, reject) => {
        let searchResults: any[] = [];

        Pool.query(query)
          .then((res) => {
            // 1. Get all questions matching query
            const questions = res.rows;
            let q_promises: any = [];

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
              log.info(searchResults);
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

  // Users API
  static Users = class {
    static updateBio = (body: any) => {
      const uid = body.uid;
      const newBio: string = body.newBio;

      const query = {
        text: `--sql
          UPDATE Users
          SET bio = $2
          WHERE uid::text = $1;
          `,
        values: [uid, newBio.trim()],
      };

      return new Promise((resolve, reject) => {
        Pool.query(query)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            log.fatal(error);
            reject(error);
          });
      });
    };

    static getUserQuestions = (uid: string) => {
      const query = {
        text: `--sql
          SELECT *
          FROM Questions
          WHERE uid::text = $1;
          `,
        values: [uid],
      };

      return new Promise((resolve, reject) => {
        let feedResults: any[] = [];

        Pool.query(query)
          .then((res) => {
            // 1. Get all questions matching query
            const questions = res.rows;
            let q_promises: any = [];

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
              resolve(feedResults);
            });
          })
          .catch((error) => {
            log.fatal(error);
            reject(error);
          });
      });
    };

    static getUserFromUsername = (username: string) => {
      const query = {
        text: `--sql
          SELECT *
          FROM Users
          WHERE username = $1;
          `,
        values: [username.trim()],
      };

      return new Promise((resolve, reject) => {
        Pool.query(query)
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
        Pool.query(query)
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
          SELECT
            q.*
          FROM Questions q
          WHERE qid::TEXT = $1
          FETCH FIRST ROW ONLY;
        `,
        values: [qid],
      };

      return new Promise((resolve, reject) => {
        Pool.query(query)
          .then((res) => {
            const question = res.rows[0];
            // Get answers to question
            this.getAnswers(qid).then((answers: Answer[]) => {
              // Get best answer (if exists)
              this.getBestAnswer(qid).then((bestAnswer: BestAnswer) => {
                if (bestAnswer) {
                  const bestAnswer_index = answers.findIndex(
                    (x: Answer) => x.qid === bestAnswer.qid
                  );
                  answers[bestAnswer_index].bestAnswer = true;
                }

                resolve({
                  question,
                  answers,
                });
              });
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
          FROM BestAnswers b
          WHERE b.qid = $1;
        `,
        values: [qid],
      };

      return new Promise((resolve, reject) => {
        Pool.query(query)
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
          WHERE a.qid::TEXT = $1;
        `,
        values: [qid],
      };

      return new Promise((resolve, reject) => {
        Pool.query(query)
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
        Pool.query(query)
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
          FROM Karma
          WHERE qid::TEXT = $1 AND uid::TEXT = $2;
        `,
        values: [parsed.qid, parsed.uid],
      };

      return new Promise((resolve, reject) => {
        Pool.query(query)
          .then((res) => {
            const sum: number = Number(res.rows[0].sum) || 0;
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
        Pool.query(query)
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
