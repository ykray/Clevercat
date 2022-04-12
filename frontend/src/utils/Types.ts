export type Question = {
  qid: string;
  uid: string;
  username: string;
  status: string;
  title: string;
  body: string;
  topic: string;
  resolved: boolean;
  q_timestamp: Date;
};

export type Answer = {
  qid: string;
  uid: string;
  username: string;
  status: string;
  a_timestamp: Date;
  body: string;
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
  color?: string;
};

export type Author = {
  user: User;
  authorType?: AuthorType;
  timestamp?: Date;
};

export type KarmaVote = {
  qid: string;
  uid: string;
  voter_uid: string;
  type: VoteType;
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
