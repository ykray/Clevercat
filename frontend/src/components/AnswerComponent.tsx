import React from 'react';

// Data
import { Answer, Author, AuthorType } from '../utils/Types';

// Components
import KarmaVoter from './KarmaVoter';
import AuthorComponent from './AuthorComponent';

// MUI
import { Stack } from '@mui/material';

type Props = {
  answer: Answer;
};

const AnswerComponent = ({ answer }: Props) => {
  const author: Author = {
    user: {
      uid: answer.uid,
      username: answer.username,
      status: answer.status,
    },
    authorType: AuthorType.Answerer,
    timestamp: answer.a_timestamp,
  };

  return (
    <div className="answer-container">
      <Stack direction={'row'} spacing={1}>
        <KarmaVoter answer={answer} />
        <Stack
          direction={'column'}
          justifyContent={'flex-end'}
          alignItems={'flex-end'}
        >
          <div className="answer-body">
            <p>{answer.body}</p>
          </div>
          <AuthorComponent author={author} />
        </Stack>
      </Stack>
    </div>
  );
};

export default AnswerComponent;
