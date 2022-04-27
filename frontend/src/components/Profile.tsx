import React, { useState, useEffect } from 'react';

// MUI
import { Snackbar, SnackbarContent, Stack, TextField } from '@mui/material';
import { Check as SuccessIcon } from '@mui/icons-material';

// Data
import API from '../data/FrontendAPI';

// Utils
import { CLIENT_UID } from '../utils/Constants';

// Types
import { QuestionPost, User } from '../utils/Types';
import Feed from './Feed';

export default function Profile() {
  const [user, setUser] = useState<User>();
  const [posts, setPosts] = useState<QuestionPost[]>([]);
  const [bioInput, setBioInput] = useState<string>();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>();

  useEffect(() => {
    API.Users.getUser(CLIENT_UID).then((user) => {
      setUser(user);
    });

    API.Users.getUserQuestions(CLIENT_UID).then((res) => {
      setPosts(res);
    });
  }, []);

  useEffect(() => {
    if (user) {
      setBioInput(user.bio);
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

  const renderMyPosts = () => {
    return posts ? (
      <>
        <h2 style={{ marginBottom: 15 }}>
          {posts.length}
          {posts.length === 1 ? ' question' : ' questions'} asked
        </h2>
        <Feed posts={posts} />
      </>
    ) : null;
  };

  return user ? (
    <div className={'profile-container'}>
      <Stack spacing={10}>
        <Stack>
          <Stack direction={'row'} spacing={3}>
            {renderAvatar()}
            <Stack spacing={3}>
              <Stack direction={'row'} spacing={'12px'}>
                <h2>{user.username}</h2>
                <div className={'profile-status'}>
                  <p>{user.status}</p>
                </div>
              </Stack>
              <TextField
                value={bioInput}
                label={'Bio'}
                onChange={(e: any) => {
                  setBioInput(e.target.value);
                }}
                onBlur={(e: any) => {
                  API.Users.updateBio(user.uid, e.target.value).then(() => {
                    setSnackbarMessage('Your bio has been updated!');
                    setSnackbarOpen(true);
                  });
                }}
              />
            </Stack>
          </Stack>
        </Stack>
        <Stack>{renderMyPosts()}</Stack>
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
  ) : null;
}
