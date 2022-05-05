import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

// Assets
import styles from '../../assets/sass/_variables.scss';

// MUI
import { Snackbar, Stack, TextField } from '@mui/material';

// Data
import API from '../../data/FrontendAPI';
import { UserContext } from '../../App';

// Types
import { User } from '../../utils/Types';
import { ChevronLeft } from '@mui/icons-material';

export default function EditProfile() {
  const currentUser = useContext(UserContext);

  // States
  const [user, setUser] = useState<User>();

  const [bioInput, setBioInput] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [cityInput, setCityInput] = useState<string>('');
  const [stateInput, setStateInput] = useState<string>('');
  const [countryInput, setCountryInput] = useState<string>('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>();

  useEffect(() => {
    if (currentUser) {
      API.Users.getUser(currentUser).then((res) => {
        setUser(res);
      });
    }
  });

  useEffect(() => {
    if (user) {
      setBioInput(user.bio ?? '');
      setEmailInput(user.email ?? '');
      setCityInput(user.city ?? '');
      setStateInput(user.state ?? '');
      setCountryInput(user.country ?? '');
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
      <Stack alignItems={'center'} spacing={2}>
        <div
          className={'profile-avatar'}
          style={{
            backgroundColor: user.color,
          }}
        >
          {user.username[0].toUpperCase()}
        </div>
        <p
          onClick={() => {
            API.Users.updateProfile('color', '').then(() => {
              setSnackbarMessage('Your avatar color has been updated!');
              setSnackbarOpen(true);
            });
          }}
          style={{
            cursor: 'pointer',
            fontSize: '0.9rem',
            color: styles.color_primary_500,
          }}
        >
          Change color
        </p>
      </Stack>
    ) : null;
  };

  return user ? (
    <div className={'profile-container'}>
      <Link to={`/@${user.username}`}>
        <Stack direction={'row'} alignItems={'center'}>
          <ChevronLeft
            style={{
              width: 25,
              height: 25,
              color: styles.color_primary_500,
            }}
          />
          Back to profile
        </Stack>
      </Link>

      <h1>Edit Profile</h1>
      <Stack spacing={10}>
        <Stack>
          <Stack direction={'row'} spacing={3}>
            {renderAvatar()}
            <Stack justifyContent={'center'} spacing={3}>
              <Stack direction={'row'} alignItems={'flex-start'} spacing={2}>
                <Stack spacing={1}>
                  <h2>{user.username}</h2>
                </Stack>
              </Stack>

              <TextField
                multiline
                value={bioInput}
                label={'Bio'}
                placeholder={'Write a bio!'}
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

              <TextField
                multiline
                value={emailInput}
                label={'Email'}
                placeholder={'Email'}
                onChange={(e: any) => {
                  setEmailInput(e.target.value);
                }}
                onBlur={(e: any) => {
                  API.Users.updateProfile('email', e.target.value).then(() => {
                    setSnackbarMessage('Your email has been updated!');
                    setSnackbarOpen(true);
                  });
                }}
              />
              <Stack direction={'row'} spacing={2}>
                <TextField
                  multiline
                  value={cityInput}
                  label={'City'}
                  placeholder={'City'}
                  onChange={(e: any) => {
                    setCityInput(e.target.value);
                  }}
                  onBlur={(e: any) => {
                    API.Users.updateProfile('city', e.target.value).then(() => {
                      setSnackbarMessage('Your city has been updated!');
                      setSnackbarOpen(true);
                    });
                  }}
                />
                <TextField
                  multiline
                  value={stateInput}
                  label={'State'}
                  placeholder={'State'}
                  onChange={(e: any) => {
                    setStateInput(e.target.value);
                  }}
                  onBlur={(e: any) => {
                    API.Users.updateProfile('state', e.target.value).then(
                      () => {
                        setSnackbarMessage('Your state has been updated!');
                        setSnackbarOpen(true);
                      }
                    );
                  }}
                />
                <TextField
                  multiline
                  value={countryInput}
                  label={'Country'}
                  placeholder={'Country'}
                  onChange={(e: any) => {
                    setCountryInput(e.target.value);
                  }}
                  onBlur={(e: any) => {
                    API.Users.updateProfile('country', e.target.value).then(
                      () => {
                        setSnackbarMessage('Your country has been updated!');
                        setSnackbarOpen(true);
                      }
                    );
                  }}
                />
              </Stack>
            </Stack>
          </Stack>
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
  ) : null;
}
