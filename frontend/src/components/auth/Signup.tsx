import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

// Assets
import KittyImage from '../../assets/images/kitty.png';
import styles from '../../assets/sass/_variables.scss';

// Data + Utils
import API from '../../data/FrontendAPI';
import { AccountData } from '../../utils/Types';

// MUI
import { Button, Stack, TextField } from '@mui/material';
import {
  Lock as PasswordIcon,
  EmailRounded as EmailIcon,
  Check as AvailableIcon,
  Close as TakenIcon,
} from '@mui/icons-material';

export default function Signup() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  // States inputs
  const [usernameAvailable, setUsernameAvailable] = useState<boolean>();
  const [usernameInput, setUsernameInput] = useState<string>(
    searchParams.get('u') || ''
  );
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>('');

  // States errors
  const [errorSignup, setErrorSignup] = useState(false);
  const [errorUsername, setErrorUsername] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(false);

  useEffect(() => {
    if (usernameInput) {
      const usernameRegex =
        /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

      if (usernameRegex.test(usernameInput)) {
        API.Users.isUsernameAvailable(usernameInput).then((available) => {
          setUsernameAvailable(available);
        });
      } else {
        setUsernameAvailable(false);
      }
    }
  }, [usernameInput]);

  const clearErrors = () => {
    setErrorUsername(false);
    setErrorEmail(false);
    setErrorPassword(false);
    setErrorConfirmPassword(false);
  };

  const handleSignup = () => {
    const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    if (usernameInput && usernameAvailable) {
      if (emailInput && emailRegex.test(emailInput)) {
        if (passwordInput && passwordInput.length > 5) {
          if (confirmPasswordInput) {
            if (passwordInput === confirmPasswordInput) {
              // Attempt signup
              const accountData: AccountData = {
                username: usernameInput,
                email: emailInput,
                password: passwordInput,
              };

              API.Auth.signup(accountData).then((res) => {
                API.Auth.login(accountData).then((res: any) => {
                  localStorage.setItem('username', res.username);
                  navigate(`/@${res.username}`);
                });
              });
            } else {
              // Passwords don't match
              setErrorPassword(true);
              setErrorConfirmPassword(true);
            }
          } else {
            setErrorConfirmPassword(true);
          }
        } else {
          setErrorPassword(true);
        }
      } else {
        setErrorEmail(true);
      }
    } else {
      setErrorUsername(true);
    }
  };

  return (
    <div className={'login'}>
      <h1>Sign up</h1>
      <Stack spacing={2} maxWidth={500}>
        <Stack
          direction={'row'}
          alignItems={'center'}
          spacing={1}
          marginBottom={'20px'}
        >
          <p>Create your account and join our community of curious cats</p>
          <img
            src={KittyImage}
            alt={'kitty'}
            style={{ width: 19, height: 19 }}
          />
        </Stack>
        <TextField
          autoCorrect={'off'}
          autoComplete={'off'}
          value={usernameInput}
          error={errorUsername}
          placeholder={'username'}
          label={'Username'}
          onChange={(e: any) => {
            clearErrors();
            setUsernameInput(e.target.value);
          }}
          InputProps={{
            startAdornment: (
              <p
                className={'textfield-icon'}
                style={{
                  color: usernameAvailable ? styles.color_primary_500 : '',
                }}
              >
                @
              </p>
            ),
            endAdornment:
              usernameInput.length > 0 ? (
                <Stack
                  direction={'row'}
                  spacing={'5px'}
                  alignItems={'center'}
                  className={'username-availability'}
                >
                  {usernameAvailable ? (
                    <AvailableIcon
                      style={{
                        color: !usernameAvailable ? styles.color_muted_300 : '',
                      }}
                    />
                  ) : (
                    <TakenIcon
                      style={{
                        color: errorUsername
                          ? styles.color_error
                          : !usernameAvailable
                          ? styles.color_muted_300
                          : '',
                      }}
                    />
                  )}
                  <p
                    style={{
                      color: errorUsername
                        ? styles.color_error
                        : !usernameAvailable
                        ? styles.color_muted_300
                        : '',
                    }}
                  >
                    {usernameAvailable ? 'Available' : 'Taken'}
                  </p>
                </Stack>
              ) : null,
          }}
          sx={{
            input: {
              color: usernameAvailable ? styles.color_primary_500 : '',
            },
          }}
        />
        <TextField
          value={emailInput}
          error={errorEmail}
          type={'email'}
          placeholder={'email@address.com'}
          label={'Email'}
          onChange={(e: any) => {
            clearErrors();
            setEmailInput(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSignup();
            }
          }}
          InputProps={{
            startAdornment: (
              <EmailIcon
                className={'textfield-icon'}
                style={{
                  width: 17,
                  height: 17,
                }}
              />
            ),
          }}
        />
        <Stack direction={'row'} spacing={1}>
          <TextField
            type={'password'}
            error={errorPassword}
            placeholder={'Password'}
            value={passwordInput}
            label={'Password'}
            onChange={(e: any) => {
              clearErrors();
              setPasswordInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSignup();
              }
            }}
            style={{ width: '100%' }}
            InputProps={{
              startAdornment: (
                <PasswordIcon
                  className={'textfield-icon'}
                  style={{
                    width: 17,
                    height: 17,
                  }}
                />
              ),
            }}
          />
          <TextField
            type="password"
            error={errorConfirmPassword}
            placeholder={'Confirm password'}
            value={confirmPasswordInput}
            label={'Confirm password'}
            onChange={(e: any) => {
              clearErrors();
              setConfirmPasswordInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSignup();
              }
            }}
            style={{ width: '100%' }}
            InputProps={{
              startAdornment: (
                <PasswordIcon
                  className={'textfield-icon'}
                  style={{
                    width: 17,
                    height: 17,
                  }}
                />
              ),
            }}
          />
        </Stack>
        {errorSignup ? (
          <p style={{ color: styles.color_error }}>
            Failed to create an account.
          </p>
        ) : null}
        <Button
          variant={'contained'}
          style={{ width: 'auto', maxWidth: 130, marginTop: 30 }}
          onClick={handleSignup}
        >
          Signup
        </Button>
      </Stack>

      <p style={{ marginTop: 50 }}>
        Already have an account? <Link to={'/login'}>Login</Link>
      </p>
    </div>
  );
}
