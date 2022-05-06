import { Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import API from '../data/FrontendAPI';
import { QuestionPost } from '../utils/Types';
import Feed from './Feed';
import TopicHierarchy from './TopicHierarchy';

export default function TopicFeed() {
  const location = useLocation();
  const topicPath = location.pathname.replace('/topics/', '').replace('/', '.');

  const [posts, setPosts] = useState<QuestionPost[]>([]);

  useEffect(() => {
    API.getTopicFeed(topicPath).then((res) => {
      setPosts(res);
    });
  }, []);

  const renderPosts = () => {
    const lastDelimiter = topicPath.lastIndexOf('.') + 1;
    const topic = topicPath
      .substring(lastDelimiter, topicPath.length)
      .replace(/([A-Z])/g, ' $1');

    return posts && posts.length > 0 ? (
      <>
        <TopicHierarchy topicPath={topicPath} />
        <h1>
          <span className={'highlight'}>{topic}</span> questions
        </h1>
        <Feed posts={posts} hideTopic />
      </>
    ) : (
      <>
        <TopicHierarchy topicPath={topicPath} />
        <h1>
          No <span className={'highlight'}>{topic}</span> questions
        </h1>
        <Button
          component={Link}
          to={`/ask?topic=${topicPath}`}
          variant={'contained'}
        >
          Ask Question
        </Button>
      </>
    );
  };

  return <div className={'topic-feed'}>{renderPosts()}</div>;
}
