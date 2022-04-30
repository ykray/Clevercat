import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../assets/sass/_variables.scss';

// MUI
import { IconButton, Stack, Tooltip } from '@mui/material';

// Components
import SearchBar from './SearchBar';
import AuthorComponent from './AuthorComponent';
import { UserContext } from '../App';
import { LogoutSharp } from '@mui/icons-material';

// Data
import API from '../data/FrontendAPI';

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
            {
              currentUser ? (
                <Stack alignItems={'flex-end'} direction={'row'} spacing={0}>
                  <AuthorComponent uid={currentUser} />
                  <Tooltip title={'Logout'} placement={'top'} arrow>
                    <IconButton
                      onClick={() => {
                        API.Auth.logout().then((res) => {
                          navigate('/');
                        });
                      }}
                    >
                      <LogoutSharp
                        style={{
                          color: styles.color_muted_400,
                          width: 26,
                          height: 26,
                        }}
                      />
                    </IconButton>
                  </Tooltip>

                  {/* {location.pathname === '/ask' ? null : (
                  <div className={'hide-on-mobile'}>
                    <Button component={Link} to={'/ask'} variant={'contained'}>
                      Ask Question
                    </Button>
                  </div>
                )} */}
                </Stack>
              ) : location.pathname === '/ask' ? null : null
              // <div className={'hide-on-mobile'}>
              //   <Button component={Link} to={'/ask'} variant={'contained'}>
              //     Ask Question
              //   </Button>
              // </div>
            }
          </Stack>
          <Stack spacing={3}>
            <SearchBar mobile />
            {/* {location.pathname === '/ask' ? null : (
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
            )} */}
          </Stack>
        </Stack>
      </div>
    </>
  );
}
