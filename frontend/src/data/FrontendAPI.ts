import { ENDPOINT } from '../utils/Constants';

// Utils
import { KarmaVote, QuestionPost, SearchScope } from '../utils/Types';

export default class API {
  static getSpellingSuggestions = (string: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      fetch(`${ENDPOINT}/spellcheck/${string}`)
        .then((res) => {
          return res.text();
        })
        .then((res: any) => {
          resolve(JSON.parse(res));
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  static getHotQuestions = (): Promise<QuestionPost[]> => {
    return new Promise((resolve, reject) => {
      fetch(`${ENDPOINT}/hot`)
        .then((res) => {
          return res.text();
        })
        .then((res) => {
          const results: QuestionPost[] = JSON.parse(res);
          console.log(results);
          resolve(results);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  static Search = class {
    static search = (
      searchQuery: string,
      searchScope: SearchScope
    ): Promise<QuestionPost[]> => {
      const scope = JSON.stringify(searchScope);

      return new Promise((resolve, reject) => {
        fetch(`${ENDPOINT}/search/${scope}/${searchQuery}`)
          .then((res) => {
            return res.text();
          })
          .then((res) => {
            const results: QuestionPost[] = JSON.parse(res);

            // console.log('FrontendAPI:', results);
            resolve(results);
          })
          .catch((error) => {
            reject(error);
          });
      });
    };
  };

  // MARK: - Answers API
  static Answers = class {
    static checkIfVoted = (
      answerID: any,
      voter_uid: string
    ): Promise<number> => {
      let _answerID = JSON.stringify(answerID);

      return new Promise((resolve, reject) => {
        fetch(`${ENDPOINT}/votes/${_answerID}/${voter_uid}`)
          .then((res) => {
            return res.text();
          })
          .then((res: any) => {
            resolve(Number(res) || 0);
          })
          .catch((error) => {
            reject(error);
          });
      });
    };

    static getKarmaCount = (answerID: any): Promise<number> => {
      let _answerID = JSON.stringify(answerID);

      return new Promise((resolve, reject) => {
        fetch(`${ENDPOINT}/karma/${_answerID}`)
          .then((res) => {
            return res.text();
          })
          .then((res: any) => {
            resolve(Number(res));
          })
          .catch((error) => {
            reject(error);
          });
      });
    };

    static vote = (karmaVote: KarmaVote) => {
      return new Promise((resolve, reject) => {
        fetch(`${ENDPOINT}/upvote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(karmaVote),
        })
          .then((res) => {
            resolve(res.text());
          })
          .catch((error) => {
            reject(error);
          });
      });
    };
  };

  // MARK: - Questions API
  static Questions = class {
    static getQuestionPost = (qid: string): Promise<QuestionPost> => {
      return new Promise((resolve, reject) => {
        fetch(`${ENDPOINT}/q/${qid}`)
          .then((res) => {
            return res.text();
          })
          .then((res) => {
            const item = JSON.parse(res);
            resolve({
              question: item.question,
              answers: item.answers,
            });
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    };
  };
}
