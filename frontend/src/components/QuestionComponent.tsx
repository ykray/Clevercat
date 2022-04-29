// Data
import { AuthorType, Question } from '../utils/Types';
import AuthorComponent from './AuthorComponent';

type Props = {
  question: Question;
};

const QuestionComponent = ({ question }: Props) => {
  const renderTopicHierarchy = () => {
    const topicHierarchy = question.topic.split('.');

    return topicHierarchy.map((topic) => {
      return <li>{topic.replace(/([A-Z])/g, ' $1')}</li>;
    });
  };

  return (
    <div className={'question'}>
      <div className={'question-topic'}>
        <ul>{renderTopicHierarchy()}</ul>
      </div>
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
