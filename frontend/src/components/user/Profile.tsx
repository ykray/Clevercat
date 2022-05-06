import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';

// Assets
import styles from '../../assets/sass/_variables.scss';

// Components
import Feed from '../../components/Feed';

// Data + Utils
import API from '../../data/FrontendAPI';
import { QuestionPost, User } from '../../utils/Types';
import { UserContext } from '../../App';

// MUI
import { Button, Snackbar, Stack } from '@mui/material';

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();

  const currentUser = useContext(UserContext);

  // States
  const [notFound, setNotFound] = useState(false);
  const [user, setUser] = useState<User>();
  const [userKarma, setUserKarma] = useState(0);

  const [questionsAsked, setQuestionsAsked] = useState<QuestionPost[]>([]);
  const [questionsAnswered, setQuestionsAnswered] = useState<QuestionPost[]>(
    []
  );

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
      API.Users.getUserKarma(user.uid).then((res) => {
        setUserKarma(res);
      });
      API.Users.getUserQuestions(user.uid).then((res) => {
        setQuestionsAsked(res);
      });
      API.Users.getUserAnswers(user.uid).then((res) => {
        console.log(res);
        setQuestionsAnswered(res);
      });
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
        <h1>
          {questionsAsked.length}
          {questionsAsked.length === 1 ? ' question' : ' questions'} asked
        </h1>
        <Feed posts={questionsAsked} showQuestionBody hideMoreAnswers />
      </>
    ) : null;
  };

  const renderMyAnswers = () => {
    return questionsAnswered ? (
      <>
        <h1>
          {questionsAnswered.length}
          {questionsAnswered.length === 1 ? ' question' : ' questions'} answered
        </h1>
        <Feed posts={questionsAnswered} hideMoreAnswers />
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
          <Stack direction={'row'} alignItems={'flex-start'} spacing={3}>
            {renderAvatar()}
            <Stack justifyContent={'center'} spacing={2}>
              <Stack direction={'row'} alignItems={'flex-start'} spacing={2}>
                <Stack spacing={1}>
                  <h2>{user.username}</h2>
                  {renderStatus()}
                </Stack>
                <div className={'profile-karma'}>
                  <p>
                    {userKarma}
                    <span
                      style={{
                        paddingLeft: 3,
                        fontFamily: 'GilroySemibold',
                        color: styles.color_text_body,
                      }}
                    >
                      {' '}
                      karma
                    </span>
                  </p>
                </div>
              </Stack>

              <div className={'profile-bio'}>
                <p>{user.bio}</p>
              </div>
              <p
                style={{
                  color: styles.color_muted_400,
                  fontSize: '0.9rem',
                }}
              >
                {user.city}, {user.state} • {user.country}
              </p>

              {currentUser === user.uid ? (
                <Button
                  variant={'contained'}
                  style={{ width: 140 }}
                  onClick={() => navigate('/profile')}
                >
                  Edit Profile
                </Button>
              ) : null}
            </Stack>
          </Stack>
        </Stack>
        <Stack spacing={4}>
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
      {currentUser ? (
        <p>
          User <span className={'highlight-2'}>@{username}</span> doesn't exist.
        </p>
      ) : (
        <p>
          User <span className={'highlight-2'}>@{username}</span> doesn't exist
          (<span style={{ fontStyle: 'italic' }}>yet,</span>{' '}
          {<Link to={`/signup?u=${username}`}>claim this username!</Link>}).
        </p>
      )}
    </>
  ) : null;
}
