import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SHA256 } from 'crypto-js';

// MUI
import { Button, Stack, TextField } from '@mui/material';

// Data
import API from '../data/FrontendAPI';

export default function Login() {
  const navigate = useNavigate();

  const [usernameInput, setUsernameInput] = useState<string>(
    localStorage.getItem('username') || ''
  );
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [errorLogin, setErrorLogin] = useState(false);

  const handleLogin = () => {
    const passwordHash = SHA256(passwordInput).toString();
    API.Auth.login(usernameInput, passwordHash)
      .then((res: any) => {
        // Save username to populate login field later on (if/when the user logs out)
        localStorage.setItem('username', res.username);
        navigate(`/@${res.username}`);
      })
      .catch((error) => {
        setErrorLogin(true);
      });
  };

  return (
    <div className={'login'}>
      <h1>Welcome back!</h1>
      <Stack spacing={2} maxWidth={500}>
        <p>Enter your username and password to login.</p>

        <TextField
          value={usernameInput}
          label={'Username'}
          onChange={(e: any) => {
            setUsernameInput(e.target.value);
          }}
        />
        <TextField
          type="password"
          value={passwordInput}
          label={'Password'}
          onChange={(e: any) => {
            setPasswordInput(e.target.value);
          }}
        />
        {errorLogin ? (
          <p style={{ color: 'red' }}>Username or password incorrect.</p>
        ) : null}
        <Button
          variant={'contained'}
          style={{ width: 'auto', maxWidth: 130 }}
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
