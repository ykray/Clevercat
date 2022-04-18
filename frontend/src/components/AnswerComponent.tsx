import React from 'react';
import styles from '../assets/sass/_variables.scss';

// Data
import { Answer, AuthorType } from '../utils/Types';

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
  return (
    <div
      className="answer-container"
      style={{
        backgroundColor: answer.bestAnswer ? styles.color_primary_300 : '',
        borderColor: answer.bestAnswer ? styles.color_primary_500 : '',
      }}
    >
      {answer.bestAnswer ? (
        <Stack direction={'row'} alignItems={'center'} spacing={'20px'}>
          <BestAnswerIcon
            style={{
              color: styles.color_primary_500,
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
          <AuthorComponent
            uid={answer.uid}
            authorType={AuthorType.Answerer}
            timestamp={answer.a_timestamp}
          />
        </Stack>
      </Stack>
    </div>
  );
};

export default AnswerComponent;
