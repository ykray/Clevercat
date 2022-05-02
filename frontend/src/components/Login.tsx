import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SHA256 } from 'crypto-js';

// MUI
import { Button, Stack, TextField } from '@mui/material';

// Data
import API from '../data/FrontendAPI';

export default function Login() {
  const navigate = useNavigate();

  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');

  const handleLogin = () => {
    const passwordHash = SHA256(passwordInput).toString();
    API.Auth.login(usernameInput, passwordHash).then((res: any) => {
      console.log('Logged in as:', res);
      navigate(`/@${res.username}`);
    });
  };

  return (
    <div>
      <h1>Welcome back!</h1>
      <Stack spacing={2}>
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
        <Button
          variant={'contained'}
          style={{ width: 'auto' }}
          onClick={handleLogin}
        >
          Login
        </Button>
        <p>
          Don't have an account? <Link to={'/signup'}>Sign Up</Link>
        </p>
      </Stack>
    </div>
  );
}
