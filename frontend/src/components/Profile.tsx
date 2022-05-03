import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

// MUI
import { Snackbar, Stack, TextField } from '@mui/material';

// Data
import API from '../data/FrontendAPI';

// Types
import { QuestionPost, User } from '../utils/Types';
import Feed from './Feed';
import { UserContext } from '../App';

export default function Profile() {
  const { username } = useParams();

  const currentUser = useContext(UserContext);

  // States
  const [notFound, setNotFound] = useState(false);
  const [user, setUser] = useState<User>();

  const [questionsAsked, setQuestionsAsked] = useState<QuestionPost[]>([]);
  const [questionsAnswered, setQuestionsAnswered] = useState<QuestionPost[]>(
    []
  );

  const [bioInput, setBioInput] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>();

  useEffect(() => {
    API.Users.getUserFromUsername(String(username))
      .then((user) => {
        setUser(user);
      })
      .catch((error) => {
        setNotFound(true);
      });
  }, []);

  useEffect(() => {
    if (user) {
      API.Users.getUserQuestions(user.uid).then((res) => {
        setQuestionsAsked(res);
      });
      API.Users.getUserAnswers(user.uid).then((res) => {
        console.log(res);
        setQuestionsAnswered(res);
      });

      setBioInput(user.bio ?? '');
    }
  }, [user]);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  const renderAvatar = () => {
    return user ? (
      <div
        className={'profile-avatar'}
        style={{
          backgroundColor: user.color,
        }}
      >
        {user.username[0].toUpperCase()}
      </div>
    ) : null;
  };

  const renderMyQuestions = () => {
    return questionsAsked ? (
      <>
        <h2>
          {questionsAsked.length}
          {questionsAsked.length === 1 ? ' question' : ' questions'} asked
        </h2>
        <Feed posts={questionsAsked} />
      </>
    ) : null;
  };

  const renderMyAnswers = () => {
    return questionsAnswered ? (
      <>
        <h2>
          {questionsAnswered.length}
          {questionsAnswered.length === 1 ? ' question' : ' questions'} answered
        </h2>
        <Feed posts={questionsAnswered} />
      </>
    ) : null;
  };

  const renderStatus = () => {
    if (user) {
      return <p className={'author-status'}>{user.status}</p>;
    } else {
      return null;
    }
  };

  return user ? (
    <div className={'profile-container'}>
      <Stack spacing={10}>
        <Stack>
          <Stack direction={'row'} spacing={3}>
            {renderAvatar()}
            <Stack justifyContent={'center'} spacing={3}>
              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                <h1>{user.username}</h1>
                {renderStatus()}
              </Stack>
              {currentUser === user.uid ? (
                <TextField
                  multiline
                  value={bioInput}
                  label={'Bio'}
                  onChange={(e: any) => {
                    setBioInput(e.target.value);
                  }}
                  onBlur={(e: any) => {
                    API.Users.updateBio(e.target.value).then(() => {
                      setSnackbarMessage('Your bio has been updated!');
                      setSnackbarOpen(true);
                    });
                  }}
                />
              ) : (
                <p>{user.bio}</p>
              )}
            </Stack>
          </Stack>
        </Stack>
        <Stack spacing={5}>
          {renderMyQuestions()}
          {renderMyAnswers()}
        </Stack>
      </Stack>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbarOpen}
        autoHideDuration={3000}
        message={snackbarMessage}
        onClose={handleClose}
        // action={action}
      />
    </div>
  ) : notFound ? (
    <>
      <h1>Nothing to see here.</h1>
      <p>
        User <span className={'highlight-2'}>@{username}</span> doesn't exist (
        <span style={{ fontStyle: 'italic' }}>yet,</span>{' '}
        {<Link to={`/signup?u=${username}`}>claim this username!</Link>}).
      </p>
    </>
  ) : null;
}
