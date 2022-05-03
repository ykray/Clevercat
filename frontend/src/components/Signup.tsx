import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SHA256 } from 'crypto-js';

// Assets
import KittyImage from '../assets/images/kitty.png';

// MUI
import { Button, Grid, Stack, TextField } from '@mui/material';
import {
  Lock as PasswordIcon,
  EmailRounded as EmailIcon,
} from '@mui/icons-material';

// Data
import API from '../data/FrontendAPI';
import { AccountData } from '../utils/Types';

export default function Signup() {
  const navigate = useNavigate();

  const [usernameInput, setUsernameInput] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>('');
  const [errorSignup, setErrorSignup] = useState(false);

  const handleSignup = () => {
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
          <p>Create your account, and join our community of curious cats</p>
          <img
            src={KittyImage}
            alt={'kitty'}
            style={{ width: 19, height: 19 }}
          />
        </Stack>
        <TextField
          value={usernameInput}
          placeholder={'username'}
          label={'Username'}
          onChange={(e: any) => {
            setUsernameInput(e.target.value);
          }}
          InputProps={{
            startAdornment: <p className={'textfield-icon'}>@</p>,
          }}
        />
        <TextField
          value={emailInput}
          type={'email'}
          placeholder={'email@address.com'}
          label={'Email'}
          onChange={(e: any) => {
            setEmailInput(e.target.value);
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
            placeholder={'Password'}
            value={passwordInput}
            label={'Password'}
            onChange={(e: any) => {
              setPasswordInput(e.target.value);
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
            placeholder={'Confirm password'}
            value={confirmPasswordInput}
            label={'Confirm password'}
            onChange={(e: any) => {
              setConfirmPasswordInput(e.target.value);
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
          <p style={{ color: 'red' }}>Failed to create an account.</p>
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
