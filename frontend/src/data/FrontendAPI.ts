import { ENDPOINT } from '../utils/Constants';

// Utils
import {
  KarmaVote,
  Question,
  QuestionPost,
  SearchScope,
  User,
} from '../utils/Types';

export default class API {
  static getTopicFeed = (topicPath: string): Promise<QuestionPost[]> => {
    return new Promise((resolve, reject) => {
      fetch(`${ENDPOINT}/topics/${topicPath}`)
        .then((res) => {
          return res.text();
        })
        .then((res) => {
          const results: QuestionPost[] = JSON.parse(res);
          resolve(results);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  };

  static getAllTopics = () => {
    return new Promise((resolve, reject) => {
      fetch(`${ENDPOINT}/all-topics`)
        .then((res) => {
          return res.text();
        })
        .then((res) => {
          const topics = JSON.parse(res);
          resolve(topics);
        })
        .catch((error) => reject(error));
    });
  };

  static getSpellingSuggestions = (string: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      fetch(`${ENDPOINT}/spellcheck/${string}`)
        .then((res) => {
          return res.text();
        })
        .then((res: any) => {
          resolve(JSON.parse(res));
        })
        .catch((error) => reject(error));
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
          resolve(results);
        })
        .catch((error) => reject(error));
    });
  };

  // Auth API
  static Auth = class {
    static login = (username: string, password: string) => {
      return new Promise((resolve, reject) => {
        fetch(`${ENDPOINT}/login`, {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        })
          .then((res) => {
            return res.text();
          })
          .then((res) => {
            resolve(JSON.parse(res));
          })
          .catch((error) => reject(error));
      });
    };

    static logout = () => {
      return new Promise((resolve, reject) => {
        fetch(`${ENDPOINT}/logout`)
          .then((res) => {})
          .catch((error) => reject(error));
      });
    };

    static currentUser = (): Promise<string> => {
      return new Promise((resolve, reject) => {
        fetch(`${ENDPOINT}/current-user`, {
          credentials: 'include',
        })
          .then((res) => {
            return res.text();
          })
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    };
  };

  // Search API
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

  // Answers API
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
          .catch((error) => reject(error));
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
          .catch((error) => reject(error));
      });
    };

    static vote = (karmaVote: KarmaVote) => {
      return new Promise((resolve, reject) => {
        fetch(`${ENDPOINT}/vote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(karmaVote),
        })
          .then((res) => {
            resolve(res.text());
          })
          .catch((error) => reject(error));
      });
    };
  };

  // Users API
  static Users = class {
    static askQuestion = (question: Question) => {
      return new Promise((resolve, reject) => {
        fetch(`${ENDPOINT}/ask`, {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(question),
        })
          .then((res) => {
            return res.text();
          })
          .then((res) => {
            resolve(JSON.parse(res));
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    };

    static updateBio = (newBio: string) => {
      const body = {
        newBio: newBio.trim(),
      };

      return new Promise((resolve, reject) => {
        fetch(`${ENDPOINT}/updateBio`, {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        })
          .then((res) => {
            resolve(res.text());
          })
          .catch((error) => reject(error));
      });
    };

    static getUserQuestions = (uid: string): Promise<QuestionPost[]> => {
      return new Promise((resolve, reject) => {
        fetch(`${ENDPOINT}/u/${uid}/questions`)
          .then((res) => {
            return res.text();
          })
          .then((res) => {
            const results: QuestionPost[] = JSON.parse(res);
            resolve(results);
          })
          .catch((error) => reject(error));
      });
    };

    static getUserFromUsername = (username: string): Promise<User> => {
      return new Promise((resolve, reject) => {
        fetch(`${ENDPOINT}/usernames/${username}`)
          .then((res) => {
            return res.text();
          })
          .then((res) => {
            resolve(JSON.parse(res));
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    };

    static getUser = (uid: string): Promise<User> => {
      return new Promise((resolve, reject) => {
        fetch(`${ENDPOINT}/u/${uid}`)
          .then((res) => {
            return res.text();
          })
          .then((res) => {
            resolve(JSON.parse(res));
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    };
  };

  // Questions API
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
