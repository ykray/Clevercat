import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Assets
import styles from '../assets/sass/_variables.scss';

// MUI
import { Button, Stack, TextField } from '@mui/material';
import { Lock as PasswordIcon } from '@mui/icons-material';

// Data
import API from '../data/FrontendAPI';
import { AccountData } from '../utils/Types';

export default function Login() {
  const navigate = useNavigate();

  const [usernameInput, setUsernameInput] = useState<string>(
    localStorage.getItem('username') || ''
  );
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [errorLogin, setErrorLogin] = useState(false);

  const handleLogin = () => {
    const accountData: AccountData = {
      username: usernameInput,
      password: passwordInput,
    };
    API.Auth.login(accountData)
      .then((res: any) => {
        localStorage.setItem('username', res.username);
        navigate(`/@${res.username}`);
      })
      .catch((error) => {
        setErrorLogin(true);
      });
  };

  useEffect(() => {
    if (errorLogin) {
      setPasswordInput('');
    }
  }, [errorLogin]);

  return (
    <div className={'login'}>
      <h1>Welcome back!</h1>
      <Stack spacing={2} maxWidth={500}>
        <p style={{ marginBottom: 30 }}>
          Enter your username and password to login.
        </p>

        <TextField
          value={usernameInput}
          label={'Username'}
          placeholder={'username'}
          onChange={(e: any) => {
            setUsernameInput(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleLogin();
            }
          }}
          InputProps={{
            startAdornment: <p className={'textfield-icon'}>@</p>,
          }}
        />
        <TextField
          type="password"
          value={passwordInput}
          label={'Password'}
          placeholder={'Password'}
          onChange={(e: any) => {
            setPasswordInput(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleLogin();
            }
          }}
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
        {errorLogin ? (
          <p
            style={{
              color: styles.color_error,
            }}
          >
            Username or password incorrect, try again.
          </p>
        ) : null}
        <Button
          variant={'contained'}
          style={{ width: 'auto', maxWidth: 130, marginTop: 30 }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Stack>
      <p style={{ marginTop: 50 }}>
        Don't have an account? <Link to={'/signup'}>Sign Up</Link>
      </p>
    </div>
  );
}
