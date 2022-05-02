import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SHA256 } from 'crypto-js';

// Assets
import KittyImage from '../assets/images/kitty.png';

// MUI
import { Button, Stack, TextField } from '@mui/material';

// Data
import API from '../data/FrontendAPI';

export default function Signup() {
  const navigate = useNavigate();

  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>('');
  const [errorSignup, setErrorSignup] = useState(false);

  const handleSignup = () => {
    const passwordHash = SHA256(passwordInput).toString();
  };

  return (
    <div className={'login'}>
      <h1>Sign up</h1>
      <Stack spacing={2} maxWidth={500}>
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
          <p>Create your account, and join our community of curious cats</p>
          <img
            src={KittyImage}
            alt={'kitty'}
            style={{ width: 19, height: 19 }}
          />
        </Stack>
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
        <TextField
          type="password"
          value={confirmPasswordInput}
          label={'Confirm password'}
          onChange={(e: any) => {
            setConfirmPasswordInput(e.target.value);
          }}
        />
        {errorSignup ? (
          <p style={{ color: 'red' }}>Failed to create an account.</p>
        ) : null}
        <Button
          variant={'contained'}
          style={{ width: 'auto', maxWidth: 130 }}
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
