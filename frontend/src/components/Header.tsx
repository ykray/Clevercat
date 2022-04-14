import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

// Assets
import styles from '../assets/sass/_variables.scss';

// MUI
import { Button, Stack } from '@mui/material';

// Components
import SearchBar from './SearchBar';
import AuthorComponent from './AuthorComponent';
import { CLIENT_USER } from '../utils/Constants';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
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
          <Stack alignItems={'flex-end'} spacing={2}>
            <AuthorComponent author={{ user: CLIENT_USER }} />

            {location.pathname === '/ask' ? null : (
              <div className={'hide-on-mobile'}>
                <Button component={Link} to={'/ask'} variant={'contained'}>
                  Ask Question
                </Button>
              </div>
            )}
          </Stack>
        </Stack>
        <Stack spacing={3}>
          <SearchBar mobile />
          {location.pathname === '/ask' ? null : (
            <div className="hide-on-desktop">
              <Button component={Link} to={'/ask'} variant={'contained'}>
                Ask Question
              </Button>
            </div>
          )}
        </Stack>
      </Stack>
    </div>
  );
}
