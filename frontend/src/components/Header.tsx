import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../App';

// Data
import API from '../data/FrontendAPI';

// Assets
import styles from '../assets/sass/_variables.scss';

// MUI
import {
  ClickAwayListener,
  IconButton,
  Slide,
  Stack,
  Tooltip,
} from '@mui/material';
import { LogoutSharp, Menu as MenuIcon } from '@mui/icons-material';

// Components
import SearchBar from './SearchBar';
import AuthorComponent from './AuthorComponent';
import Menu from './Menu';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useContext(UserContext);

  // States
  const [showMenu, setShowMenu] = useState(false);

  const handleClickAway = () => {
    if (showMenu === true) {
      setShowMenu(false);
    }
  };

  return (
    <>
      <ClickAwayListener onClickAway={handleClickAway}>
        <div className="header">
          <Stack justifyContent="center" alignItems={'stretch'} spacing={2}>
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              alignItems={'flex-start'}
              spacing={2}
            >
              <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <Menu show={showMenu} />

                <div className={'logo'} onClick={() => navigate('/')}>
                  ask
                  <span className="highlight">about</span>
                </div>
                <IconButton
                  className={'icon-button'}
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <MenuIcon
                    style={{
                      width: 27,
                      height: 27,
                      color: styles.color_surface_500,
                    }}
                  />
                </IconButton>
              </Stack>

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
            <SearchBar mobile />
          </Stack>
        </div>
      </ClickAwayListener>
    </>
  );
}
