export type AccountData = {
  username: string;
  email?: string;
  password: string;
};

export type Topic = {
  category: string;
  subtopic: string | null;
};

export type Question = {
  qid?: string;
  uid?: string;
  username?: string;
  color?: string;
  status?: string;
  title: string;
  body: string;
  topic: string;
  q_timestamp?: Date;
};

export type Answer = {
  qid: string;
  q_uid?: string;
  uid: string;
  username?: string;
  color?: string;
  status?: string;
  a_timestamp?: Date;
  body: string;
  bestAnswer?: boolean;
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
  color: string;
};

export type Author = {
  user: User;
  authorType?: AuthorType | null;
  timestamp?: Date;
};

export type KarmaVote = {
  qid: string;
  uid: string;
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

export type SearchQuery = {
  query: string;
  scope: SearchScope;
};
