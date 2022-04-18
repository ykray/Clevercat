export type Question = {
  qid: string;
  uid: string;
  username: string;
  status: string;
  title: string;
  body: string;
  topic: string;
  q_timestamp: Date;
};

export type Answer = {
  qid: string; // part of answer ID
  uid: string; // part of answer ID
  username: string;
  status: string;
  a_timestamp: Date;
  body: string;
  bestAnswer?: boolean;
};

export type BestAnswer = {
  qid: string;
  uid: string;
  ba_timestamp: Date;
};

export type QuestionPost = {
  question: Question;
  answers?: Answer[];
};

export enum AuthorType {
  Asker,
  Answerer,
}

export type User = {
  uid: string;
  username: string;
  bio?: string;
  status: string;
};

export type Author = {
  user: User;
  authorType?: AuthorType;
  timestamp?: Date;
};

export type KarmaVote = {
  qid: string; // part of answer ID
  uid: string; // part of answer ID
  voter_uid: string;
  vote: VoteType;
};

export enum VoteType {
  Upvote = 1,
  Downvote = -1,
}

export enum SearchScope {
  Questions = 'questions',
  Answers = 'answers',
  Full = 'full',
}
