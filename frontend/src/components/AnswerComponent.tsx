import React from 'react';
import styles from '../assets/sass/_variables.scss';

// Data
import { Answer, Author, AuthorType } from '../utils/Types';

// Components
import KarmaVoter from './KarmaVoter';
import AuthorComponent from './AuthorComponent';

// MUI
import { Stack } from '@mui/material';
import { Stars as BestAnswerIcon } from '@mui/icons-material';

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
    <div
      className="answer-container"
      style={{
        borderColor: answer.bestAnswer ? styles.color_surface_400 : '',
      }}
    >
      {answer.bestAnswer ? (
        <Stack direction={'row'} alignItems={'center'} spacing={2}>
          <BestAnswerIcon
            style={{
              color: styles.color_green_500,
              width: 23,
              height: 23,
            }}
          />
          <h3>Best Answer</h3>
        </Stack>
      ) : null}

      <Stack direction={'row'} spacing={1}>
        <Stack
          direction={'column'}
          alignItems={'center'}
          justifyContent={'flex-start'}
          style={{ marginLeft: -15, marginTop: 5 }}
        >
          <KarmaVoter answer={answer} />
        </Stack>
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
