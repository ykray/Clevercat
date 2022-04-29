import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../data/FrontendAPI';
import { QuestionPost } from '../utils/Types';
import Feed from './Feed';
import TopicHierarchy from './TopicHierarchy';

export default function TopicFeed() {
  const location = useLocation();
  const topicPath = location.pathname.replace('/topics/', '').replace('/', '.');

  const [posts, setPosts] = useState<QuestionPost[]>([]);

  useEffect(() => {
    console.log(topicPath);
    API.getTopicFeed(topicPath).then((res) => {
      setPosts(res);
    });
  }, []);

  const renderPosts = () => {
    return posts && posts.length > 0 ? (
      <>
        <TopicHierarchy topicPath={topicPath} />
        <Feed posts={posts} hideTopic />
      </>
    ) : (
      <>
        <TopicHierarchy topicPath={topicPath} />
      </>
    );
  };

  return <>{renderPosts()}</>;
}
