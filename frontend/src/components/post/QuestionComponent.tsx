// Components
import AuthorComponent from '../../components/user/AuthorComponent';
import TopicHierarchy from '../../components/TopicHierarchy';

// Data + Utils
import { AuthorType, Question } from '../../utils/Types';

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
