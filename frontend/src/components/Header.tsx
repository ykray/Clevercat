import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

// MUI
import { Button, Stack } from '@mui/material';

// Components
import SearchBar from './SearchBar';
import AuthorComponent from './AuthorComponent';
import { UserContext } from '../App';
import { Logout, PersonAdd } from '@mui/icons-material';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useContext(UserContext);

  return (
    <>
      <div className="header">
        <Stack justifyContent="center" alignItems={'stretch'} spacing={2}>
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'flex-start'}
            spacing={2}
          >
            <div className={'logo'} onClick={() => navigate('/')}>
              ask
              <span className="highlight">about</span>
            </div>
            <SearchBar />
            {currentUser ? (
              <Stack alignItems={'flex-end'} spacing={2}>
                <AuthorComponent uid={currentUser} />

                {location.pathname === '/ask' ? null : (
                  <div className={'hide-on-mobile'}>
                    <Button component={Link} to={'/ask'} variant={'contained'}>
                      Ask Question
                    </Button>
                  </div>
                )}
              </Stack>
            ) : location.pathname === '/ask' ? null : (
              <div className={'hide-on-mobile'}>
                <Button component={Link} to={'/ask'} variant={'contained'}>
                  Ask Question
                </Button>
              </div>
            )}
          </Stack>
          <Stack spacing={3}>
            <SearchBar mobile />
            {location.pathname === '/ask' ? null : (
              <div
                className="hide-on-desktop"
                style={{
                  marginBottom: 30,
                }}
              >
                <Button component={Link} to={'/ask'} variant={'contained'}>
                  Ask Question
                </Button>
              </div>
            )}
          </Stack>
        </Stack>
      </div>
    </>
  );
}
