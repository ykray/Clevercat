import { Stack } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Assets
import styles from '../assets/sass/_variables.scss';

// Data
import API from '../data/FrontendAPI';
import { QuestionPost } from '../utils/Types';

// Components
import AnswerComponent from './AnswerComponent';
import QuestionComponent from './QuestionComponent';

export default function PostComponent() {
  let { qid } = useParams();

  // States
  const [post, setPost] = useState<QuestionPost>();

  useEffect(() => {
    if (qid) {
      API.Questions.getQuestionPost(qid).then((post) => {
        setPost(post);
      });
    }
  }, []);

  const renderQuestion = () => {
    return post ? <QuestionComponent question={post.question} /> : null;
  };

  const renderAnswers = () => {
    return post && post.answers && post.answers.length > 0 ? (
      <>
        <h2>
          {post.answers.length} Answer{post.answers.length === 1 ? '' : 's'}
        </h2>

        <Stack spacing={3}>
          {post.answers.map((answer) => {
            return <AnswerComponent answer={answer} key={answer.uid} />;
          })}
        </Stack>
      </>
    ) : (
      <h2 style={{ color: styles.color_muted_400 }}>No answers yet...</h2>
    );
  };

  return (
    <>
      {renderQuestion()}
      {renderAnswers()}
    </>
  );
}
