// Utils
import { AuthorType, Question } from '../utils/Types';

// Components
import AuthorComponent from './AuthorComponent';
import TopicHierarchy from './TopicHierarchy';

type Props = {
  question: Question;
};

const QuestionComponent = ({ question }: Props) => {
  return (
    <div className={'question'}>
      <TopicHierarchy topicPath={question.topic} />
      <h1 className={'question-title'}>{question.title}</h1>
      <div className="question-body">
        <p>{question.body}</p>
      </div>
      <br />
      <AuthorComponent
        uid={question.uid}
        authorType={AuthorType.Asker}
        timestamp={question.q_timestamp}
      />
    </div>
  );
};

export default QuestionComponent;
