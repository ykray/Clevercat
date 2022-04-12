// Data
import { Author, AuthorType, Question } from '../utils/Types';
import AuthorComponent from './AuthorComponent';

type Props = {
  question: Question;
};

const QuestionComponent = ({ question }: Props) => {
  const author: Author = {
    user: {
      uid: question.uid,
      username: question.username,
      status: question.status,
    },
    authorType: AuthorType.Asker,
    timestamp: question.q_timestamp,
  };

  return (
    <div className={'question'}>
      <h1 className={'question-title'}>{question.title}</h1>
      <div className={'question-topic'}>{question.topic}</div>
      <div className="question-body">
        <p>{question.body}</p>
      </div>
      <br />
      <AuthorComponent author={author} />
    </div>
  );
};

export default QuestionComponent;
