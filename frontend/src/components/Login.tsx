import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SHA256 } from 'crypto-js';

// MUI
import { Button, Stack, TextField } from '@mui/material';

// Data
import API from '../data/FrontendAPI';

export default function Login() {
  const navigate = useNavigate();

  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');

  const login = () => {
    API.Auth.login(usernameInput, SHA256(passwordInput).toString()).then(
      (res: any) => {
        console.log('Logged in:', res);
        navigate(`/@${res.username}`);
      }
    );
  };

  return (
    <div>
      <h1>Login</h1>
      <Stack spacing={2}>
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
        <Button variant={'contained'} style={{ width: 'auto' }} onClick={login}>
          Login
        </Button>
      </Stack>
    </div>
  );
}
