import React, { useContext } from 'react';
import styles from '../assets/sass/_variables.scss';

// Data
import { Answer, AuthorType } from '../utils/Types';

// Components
import KarmaVoter from './KarmaVoter';
import AuthorComponent from './AuthorComponent';

// MUI
import { Stack } from '@mui/material';
import { UserContext } from '../App';

type Props = {
  answer: Answer;
};

const AnswerComponent = ({ answer }: Props) => {
  const currentUser = useContext(UserContext);

  return (
    <div
      className="answer-container"
      style={{
        backgroundColor: answer.bestAnswer ? styles.color_primary_300 : '',
        // borderColor: answer.bestAnswer ? styles.color_primary_500 : '',
      }}
    >
      {currentUser === answer.uid}

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
