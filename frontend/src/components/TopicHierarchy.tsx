import React from 'react';

type Props = {
  noClick?: boolean;
  topicPath: string;
};

export default function TopicHierarchy({ noClick = false, topicPath }: Props) {
  const renderTopicHierarchy = () => {
    const topicHierarchy = topicPath.split('.');

    const path = (topic: string) => {
      const index = topicPath.indexOf(topic);
      return topicPath.replace('.', '/').substring(0, index + topic.length);
    };

    return topicHierarchy.map((topic) => {
      return (
        <li style={{ pointerEvents: noClick ? 'none' : 'auto' }} key={topic}>
          <span
            onClick={() => (window.location.href = `/topics/${path(topic)}`)}
          >
            {topic.replace(/([A-Z])/g, ' $1')}
          </span>
        </li>
      );
    });
  };

  return (
    <div className={'question-topic'}>
      <ul>{renderTopicHierarchy()}</ul>
    </div>
  );
}
