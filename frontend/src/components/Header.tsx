import React from 'react';
import { useNavigate } from 'react-router-dom';

// Assets
import styles from '../assets/sass/_variables.scss';

// MUI
import { Stack } from '@mui/material';

// Components
import SearchBar from './SearchBar';
import AuthorComponent from './AuthorComponent';
import { CLIENT_USER } from '../utils/Constants';

export default function Header() {
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
          <div className="hide-on-mobile">
            <SearchBar />
          </div>
          <AuthorComponent author={{ user: CLIENT_USER }} />
        </Stack>
        <div className="hide-on-desktop">
          <SearchBar />
        </div>
      </Stack>
    </div>
  );
}
