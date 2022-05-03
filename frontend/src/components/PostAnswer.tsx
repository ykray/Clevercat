import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';

// MUI
import { Button, Stack, TextField } from '@mui/material';
// Data
import API from '../data/FrontendAPI';
import { Answer, User } from '../utils/Types';

type Props = {
  qid: string | undefined;
};

export default function PostAnswer({ qid }: Props) {
  const currentUser = useContext(UserContext);

  // States
  const [user, setUser] = useState<User>();
  const [answerInput, setAnswerInput] = useState<string>('');

  useEffect(() => {
    if (currentUser) {
      API.Users.getUser(currentUser).then((user) => {
        setUser(user);
      });
    }
  }, [currentUser]);

  const handleChange = (e: any) => {
    const answer = e.target.value;

    setAnswerInput(answer);
  };

  const handleClick = () => {
    if (qid) {
      const answer = {
        qid,
        body: answerInput,
      };
      API.Answers.postAnswer(answer).then((res) => {});
    }
  };

  return (
    <div className={'post-answer'}>
      <Stack spacing={2}>
        <Stack direction={'row'} alignItems={'flex-end'} spacing={2}>
          <h2>Post an answer</h2>
          <p>
            answering as{' '}
            <Link to={`/@${user?.username}`}>@{user?.username}</Link>
          </p>
        </Stack>

        <Stack alignItems={'flex-end'} spacing={2}>
          <TextField
            multiline
            minRows={5}
            value={answerInput}
            onChange={handleChange}
            type={'text'}
            placeholder={'Answer this question...'}
            style={{ width: '100%' }}
          />
          <Button
            disabled={answerInput.length === 0}
            variant={'contained'}
            style={{ width: 'auto' }}
            onClick={handleClick}
          >
            Post Answer
          </Button>
        </Stack>
      </Stack>
    </div>
  );
}
